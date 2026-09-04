using Dapper;
using Medicare.Application.Interfaces.IClaim;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Billing;
using Medicare.Application.Models.Claim;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.Response;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class ClaimRepository : IClaimRepostitory
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public ClaimRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }

        public async Task<CreateClaimResponse> CreateClaimAsync(CreateClaimRequest model)
        {
            string procName = "USP_CreateClaim";
            CreateClaimResponse returnData = new CreateClaimResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("PatientId", model.PatientId);
                param.Add("ProfileId", model.ProfileId);

                returnData = await  _context.QuerySingleStoredProcAsync<CreateClaimResponse>(procName, param);
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
        public async Task<LineItemResponse> AddConsultationChargeAsync(AddConsultationRequest model)
        {
            string procName = "USP_AddConsultationCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);
                param.Add("Units", model.Units);
                param.Add("ChargeAmount", model.ChargeAmount);

                returnData = await  _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddLabTestChargeAsync(AddLabTestRequest model)
        {
            string procName = "USP_AddLabTestCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("LabTestCode", model.LabTestCode);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);
                param.Add("Units", model.Units);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("TestName", model.TestName);
                param.Add("LabName", model.LabName);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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

        // ── Story 4: Scan Charge ──────────────────────────────────────────────

        public async Task<LineItemResponse> AddScanChargeAsync(AddScanRequest model)
        {
            string procName = "USP_AddScanCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("ScanType", model.ScanType);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);
                param.Add("Units", model.Units);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("BodyPart", model.BodyPart);
                param.Add("Findings", model.Findings);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddICUChargeAsync(AddICURequest model)
        {
            string procName = "USP_AddICUCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("ICUType", model.ICUType);
                param.Add("Hours", model.Hours);
                param.Add("StartTime", model.StartTime);
                param.Add("EndTime", model.EndTime);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddBedChargeAsync(AddBedChargeRequest model)
        {
            string procName = "USP_AddBedCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("RoomType", model.RoomType);
                param.Add("Days", model.Days);
                param.Add("StartDate", model.StartDate);
                param.Add("EndDate", model.EndDate);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddSurgeryChargeAsync(AddSurgeryRequest model)
        {
            string procName = "USP_AddSurgeryCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("SurgeryType", model.SurgeryType);
                param.Add("SurgeonId", model.SurgeonId);
                param.Add("DurationMinutes", model.DurationMinutes);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddPharmacyChargeAsync(AddPharmacyRequest model)
        {
            string procName = "USP_AddPharmacyCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("MedicineName", model.MedicineName);
                param.Add("Quantity", model.Quantity);
                param.Add("Dosage", model.Dosage);
                param.Add("UnitPrice", model.UnitPrice);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddNursingChargeAsync(AddNursingRequest model)
        {
            string procName = "USP_AddNursingCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("Hours", model.Hours);
                param.Add("NurseId", model.NurseId);
                param.Add("ChargeAmount", model.ChargeAmount);
                param.Add("CPTCode", model.CPTCode);
                param.Add("ICDCode", model.ICDCode);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<LineItemResponse> AddConsumableChargeAsync(AddConsumableRequest model)
        {
            string procName = "USP_AddConsumableCharge";
            LineItemResponse returnData = new LineItemResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("ItemName", model.ItemName);
                param.Add("Quantity", model.Quantity);
                param.Add("UnitPrice", model.UnitPrice);
                param.Add("ChargeAmount", model.ChargeAmount);

                returnData = await _context.QuerySingleStoredProcAsync<LineItemResponse>(procName, param);
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
        public async Task<SubmitClaimResponse> SubmitClaimAsync(int claimId)
        {
            string procName = "USP_SubmitClaim";
            SubmitClaimResponse returnData = new SubmitClaimResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", claimId);

                returnData = await _context.QuerySingleStoredProcAsync<SubmitClaimResponse>(procName, param);
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
        public async Task<PostInsurancePaymentResponse> PostInsurancePaymentAsync(PostInsurancePaymentRequest model)
        {
            string procName = "USP_PostInsurancePayment";
            PostInsurancePaymentResponse returnData = new PostInsurancePaymentResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("PaidAmount", model.PaidAmount);
                param.Add("PaymentReference", model.PaymentReference);
                param.Add("PaymentDate", model.PaymentDate);
                param.Add("PayerSequence", model.PayerSequence);

                returnData = await _context.QuerySingleStoredProcAsync<PostInsurancePaymentResponse>(procName, param);
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
        public async Task<PostAdjustmentResponse> PostAdjustmentAsync(PostAdjustmentRequest model)
        {
            string procName = "USP_PostInsuranceAdjustment";
            PostAdjustmentResponse returnData = new PostAdjustmentResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("LineItemId", model.LineItemId);
                param.Add("AdjustmentCode", model.AdjustmentCode);
                param.Add("AdjustmentDescription", model.AdjustmentDescription);
                param.Add("AdjustmentAmount", model.AdjustmentAmount);

                returnData = await _context.QuerySingleStoredProcAsync<PostAdjustmentResponse>(procName, param);
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
        public async Task<CalculateResponsibilityResponse> CalculatePatientResponsibilityAsync(CalculateResponsibilityRequest model)
        {
            string procName = "USP_CalculatePatientResponsibility";
            CalculateResponsibilityResponse returnData = new CalculateResponsibilityResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("Deductible", model.Deductible);
                param.Add("Coinsurance", model.Coinsurance);
                param.Add("Copay", model.Copay);

                returnData = await _context.QuerySingleStoredProcAsync<CalculateResponsibilityResponse>(procName, param);
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
        public async Task<CollectCopayResponse> CollectCopayAsync(CollectCopayRequest model)
        {
            string procName = "USP_CollectCopay";
            CollectCopayResponse returnData = new CollectCopayResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("CopayAmount", model.CopayAmount);
                param.Add("PaymentMethod", model.PaymentMethod);
                param.Add("ReferenceNo", model.ReferenceNo);

                returnData = await _context.QuerySingleStoredProcAsync<CollectCopayResponse>(procName, param);
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
        public async Task<GenerateStatementResponse> GenerateStatementAsync(int claimId)
        {
            string procName = "USP_GeneratePatientStatement";
            GenerateStatementResponse returnData = new GenerateStatementResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", claimId);

                returnData = await _context.QuerySingleStoredProcAsync<GenerateStatementResponse>(procName, param);
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
        public async Task<PostPatientPaymentResponse> PostPatientPaymentAsync(PostPatientPaymentRequest model)
        {
            string procName = "USP_PostPatientPayment";
            PostPatientPaymentResponse returnData = new PostPatientPaymentResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("AmountPaid", model.AmountPaid);
                param.Add("PaymentMethod", model.PaymentMethod);
                param.Add("ReferenceNo", model.ReferenceNo);

                returnData = await _context.QuerySingleStoredProcAsync<PostPatientPaymentResponse>(procName, param);
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
        public async Task<ForwardToSecondaryResponse> ForwardToSecondaryAsync(ForwardToSecondaryRequest model)
        {
            string procName = "USP_ForwardToSecondaryInsurance";
            ForwardToSecondaryResponse returnData = new ForwardToSecondaryResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", model.ClaimId);
                param.Add("SecondaryInsuranceId", model.SecondaryInsuranceId);
                param.Add("Notes", model.Notes);

                returnData = await _context.QuerySingleStoredProcAsync<ForwardToSecondaryResponse>(procName, param);
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

        public async Task<ClaimAuditResponse> GetClaimAuditById(int claimId)
        {
            string procName = "USP_GetClaimAuditById";
            ClaimAuditResponse returnData = new ClaimAuditResponse();
            try
            {
                var param = new DynamicParameters();
                param.Add("ClaimId", claimId);

                returnData = await _context.QueryMultipleAsync(procName, param, async multi =>
                {
                    var claims = (await multi.ReadSingleAsync<ClaimAuditSummary>());
                    var lineItems = (await multi.ReadAsync<AuditLineItem>()).ToList();
                    var payments = (await multi.ReadAsync<AuditPayment>()).ToList();
                    var adjustments = (await multi.ReadAsync<AuditAdjustment>()).ToList();
                    var responsibilities = (await multi.ReadAsync<AuditResponsibility>()).ToList();
                    var response = await multi.ReadFirstOrDefaultAsync<ProcResponseModel>();

                    return new ClaimAuditResponse
                    {
                        Claim = claims,
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
    }
}
