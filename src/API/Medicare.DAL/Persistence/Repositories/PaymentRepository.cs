using Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.IPayments;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Payments;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;

        public PaymentRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }

        public async Task<List<PaymentRecordModel>> GetPaymentRecordsByPatientIdAsync(GetPaymentRecordsRequestModel model)
        {
            string procName = "USP_GetPaymentRecordsByPatientId";
            List<PaymentRecordModel> returnData = new List<PaymentRecordModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", model.PatientId);
                param.Add("HospitalId", model.HospitalId);
                param.Add("Status", model.Status);

                returnData = await _context.QueryStoredProcListAsync<PaymentRecordModel>(procName, param);
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
    }
}