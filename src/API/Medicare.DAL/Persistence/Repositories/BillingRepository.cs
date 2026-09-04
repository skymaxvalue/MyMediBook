using Dapper;
using Medicare.Application.Interfaces.IBilling;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Claim;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.Response;
using Medicare.DAL.Persistence.Dapper;
using System.Data;
using System.Security.Claims;

namespace Medicare.DAL.Persistence.Repositories
{
    public class BillingRepository : IBillingRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public BillingRepository(IDapperContext context, IErrorLogRepository errorLogRepository)
        {
            _context = context;
            _errorLog = errorLogRepository;
        }

        public async Task<BillingSummaryModel> GetBillByClaimIdAsync(int id)
        {
            string procName = "USP_GetBillByClaimId";
            BillingSummaryModel returnData = new BillingSummaryModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", id);

                returnData = await _context.QueryMultipleAsync(procName, param, async multi =>
                {
                    var claims = (await multi.ReadAsync<ClaimSummaryModel>()).ToList();
                    var lineItems = (await multi.ReadAsync<ClaimLineItemModel>()).ToList();
                    var payments = (await multi.ReadAsync<ClaimPaymentModel>()).ToList();
                    var adjustments = (await multi.ReadAsync<ClaimAdjustmentModel>()).ToList();
                    var responsibilities = (await multi.ReadAsync<ClaimPatientResponsibilityModel>()).ToList();
                    var response = await multi.ReadFirstOrDefaultAsync<ProcResponseModel>(); 

                    return new BillingSummaryModel
                    {
                        Claims = claims,
                        LineItems = lineItems,
                        InsurancePayments = payments,
                        Adjustments = adjustments,
                        PatientResponsibility = responsibilities,
                        IsSuccess = response.IsSuccess,
                        ResponseMessage = response?.ResponseMessage 
                    };
                });
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }
            return returnData;
        }
        public async Task<List<BillingSummaryModel>> GetBillingListByPatientIdAsync(int patientId)
        {
            string procName = "USP_GetBillingListByPatientId";
            List<BillingSummaryModel> returnData = new List<BillingSummaryModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", patientId);

                returnData = await _context.QueryMultipleAsync(
                    procName,
                    param,
                    async multi =>
                    {
                        var claims = (await multi.ReadAsync<ClaimSummaryModel>()).ToList();
                        var lineItems = (await multi.ReadAsync<ClaimLineItemModel>()).ToList();
                        var payments = (await multi.ReadAsync<ClaimPaymentModel>()).ToList();
                        var adjustments = (await multi.ReadAsync<ClaimAdjustmentModel>()).ToList();
                        var responsibilities = (await multi.ReadAsync<ClaimPatientResponsibilityModel>()).ToList();
                        bool isSuccess = claims.Any();
                        string responseMessage = claims.Any() ? "Data Fetched Successfully." : "No bills found for patient";

                        var lineItemsByClaim = lineItems.ToLookup(x => x.ClaimId);
                        var paymentsByClaim = payments.ToLookup(x => x.ClaimId);
                        var adjustmentsByClaim = adjustments.ToLookup(x => x.ClaimId);
                        var responsibilitiesByClaim = responsibilities.ToLookup(x => x.ClaimId);

                        return claims
                            .Select(claim => new BillingSummaryModel
                            {
                                Claims = new List<ClaimSummaryModel> { claim },
                                LineItems = lineItemsByClaim[claim.ClaimId].ToList(),
                                InsurancePayments = paymentsByClaim[claim.ClaimId].ToList(),
                                Adjustments = adjustmentsByClaim[claim.ClaimId].ToList(),
                                PatientResponsibility = responsibilitiesByClaim[claim.ClaimId].ToList(),
                                IsSuccess = isSuccess ? 1 : 0,
                                ResponseMessage= responseMessage
                            })
                            .ToList();
                    });
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
                throw;
            }
            return returnData;
        }
    }
}
