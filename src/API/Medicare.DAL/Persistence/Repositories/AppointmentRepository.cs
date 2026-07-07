using Dapper;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.DAL.Persistence.Dapper;
using System.Data;

namespace Medicare.DAL.Persistence.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;

        public AppointmentRepository(DapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }

        public async Task<List<PatientAppointmentModel>> GetMyAppointmentListAsync(int patientId)
        {
            string procName = "USP_GetMyAppointmentList";
            List<PatientAppointmentModel> returnData = new List<PatientAppointmentModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", patientId);

                returnData = await _context.QueryStoredProcListAsync<PatientAppointmentModel>(procName, param);
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

        public async Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(int associateId)
        {
            string procName = "USP_GetAvailableAppointments";
            List<AvailableAppointmentModel> returnData = new List<AvailableAppointmentModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", associateId);

                returnData = await _context.QueryStoredProcListAsync<AvailableAppointmentModel>(procName, param);
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

        public async Task<AppointmentDetailModelDto> GetAppointmentById(int appointmentId)
        {
            string procName = "USP_GetAppointmentById";
            AppointmentDetailModelDto returnData = new AppointmentDetailModelDto();
            try
            {
                var param = new DynamicParameters();

                param.Add("AppointmentId", appointmentId);

                returnData = await _context.QuerySingleStoredProcAsync<AppointmentDetailModelDto>(procName, param);
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

        public async Task<ResponseModel> CreateAppointmentAsync(AppointmentMasterModel model)
        {
            string profileProc = "USP_AddPatientProfile";
            string appointmentProc = "USP_CreateAppointment";
            ResponseModel returnData = new ResponseModel();

            try
            {
                if (model.RelatonTypeId != null && model.RelatonTypeId != 1)
                {
                    var profileParam = new DynamicParameters();
                    profileParam.Add("PatientId", model.PatientId);
                    profileParam.Add("FirstName", model.FirstName);
                    profileParam.Add("LastName", model.LastName);
                    profileParam.Add("DateOfBirth", model.DateOfBirth);
                    profileParam.Add("Age", model.Age);
                    profileParam.Add("AgeTypeId", model.AgeTypeId);
                    profileParam.Add("Gender", model.Gender);
                    profileParam.Add("Email", model.Email);
                    profileParam.Add("PhoneNumber", model.Phone);
                    profileParam.Add("RelationTypeId", model.RelatonTypeId);

                    var profileResult = await _context.QuerySingleStoredProcAsync<ResponseModel>(profileProc, profileParam);

                    if (profileResult.IsSuccess == 0) return profileResult;

                    model.ProfileId = profileResult.ResponseId;
                }

                var param = new DynamicParameters();
                param.Add("PatientId", model.PatientId);
                param.Add("ProfileId", model.ProfileId);   
                param.Add("AssociateId", model.AssociateId);
                param.Add("SlotId", model.SlotId);
                param.Add("VisitPurpose", model.VisitPurpose);
                param.Add("VisitType", model.VisitType);
                param.Add("OtpMethod", model.OtpMethod);
                param.Add("CreatedBy", model.CreatedBy);
                param.Add("AssociateRole", model.AssociateRole);

                param.Add("Insurance", model.Insurance);
                param.Add("Provider", model.InsuranceData?.Provider);
                param.Add("Policy", model.InsuranceData?.Policy);
                param.Add("GroupId", model.InsuranceData?.GroupId);
                param.Add("HolderName", model.InsuranceData?.HolderName);
                param.Add("Address", model.InsuranceData?.Address);

                param.Add("PaymentType", model.PaymentData?.PaymentType);
                param.Add("CardHolder", model.PaymentData?.CardHolder);
                param.Add("CardNumber", model.PaymentData?.CardNumber);
                param.Add("Expiry", model.PaymentData?.Expiry);
                param.Add("CvvHash", model.PaymentData?.CvvHash, dbType: DbType.Binary);
                param.Add("CvvSalt", model.PaymentData?.CvvSalt, dbType: DbType.Binary);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(appointmentProc, param);

            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = appointmentProc,
                    Error_Trace = ex.StackTrace
                });
            }
            return returnData;
        }

        public async Task<ResponseModel> UpdateAppointmentScheduleAsync(UpdateAppointmentScheduleRequestModel model)
        {
            string procName = "USP_UpdateAppointmentSchedule";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("PatientId", model.PatientId);
                param.Add("AssociateId", model.AssociateId);
                param.Add("SlotId", model.SlotId);
                param.Add("VisitPurpose", model.VisitPurpose);
                param.Add("VisitType", model.VisitType);
                param.Add("RescheduleReason", model.RescheduleReason);
                param.Add("LastUpdatedBy", model.LastUpdatedBy);
                param.Add("AssociateRole", model.AssociateRole);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
            }
            catch(Exception ex)
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

        public async Task<ResponseModel> CancelAppointmentByIdAsync(CancelAppointmentScheduleRequestModel model)
        {
            string procName = "USP_CancelAppointment";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("PatientId", model.PatientId);
                param.Add("CancelReason", model.CancelReason);
                param.Add("LastUpdatedBy", model.LastUpdatedBy);
                param.Add("AssociateRole", model.AssociateRole);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
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
