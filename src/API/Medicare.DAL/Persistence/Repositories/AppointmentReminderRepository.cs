using Dapper;
using Medicare.Application.Interfaces.BackgroundJob.IAppointmentReminder;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.BackgroundJob.Appointment;
using Medicare.Application.Models.BackgroundJob.ReminderLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class AppointmentReminderRepository : IAppointmentReminderRepository
    {
        private readonly  IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;

        public AppointmentReminderRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<List<ReleaseableAppointmentModel>> GetReleasableAppointmentsAsync(Guid tenantId)
        {
            string procName = "USP_GetReleaseableAppointment";
            List<ReleaseableAppointmentModel> returnData = new List<ReleaseableAppointmentModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("TenantId", tenantId);

                returnData = await _context.QueryStoredProcListAsync<ReleaseableAppointmentModel>(procName, param);
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

        public async Task<List<StaleAppointmentModel>> GetStaleAppointmentListAsync(StaleAppointmentRequestModel model)
        {
            string procName = "USP_GetStaleAppointments";
            List<StaleAppointmentModel> returnData = new List<StaleAppointmentModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("TenantId", model.TenantId);
                param.Add("ThresholdMin", model.ThresholdMin);
                returnData = await _context.QueryStoredProcListAsync<StaleAppointmentModel>(procName);
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

        public async Task<ResponseModel> LogReminderAsync(ReminderLogModel model)
        {
            string procName = "USP_LogAppointmentReminder";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("TenantId", model.TenantId);
                param.Add("OtpTypeId", model.OtpTypeId);
                param.Add("PatientId", model.PatientId);
                param.Add("ReminderType", model.ReminderType);
                param.Add("NotificationChannel", model.NotificationChannel);
                param.Add("IsSuccess", model.IsSuccess);
                param.Add("SentTo", model.SentTo);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName);
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

        public async Task<ResponseModel> ReleaseAppointmentSlotAsync(ReleaseAppointmentRequestModel model)
        {
            string procName = "USP_LogAppointmentReminder";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("SlotId", model.SlotId);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName);
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

        public async Task<ResponseModel> UpdateReminderInfoAsync(UpdateAppointmentRequestModel model)
        {
            string procName = "USP_UpdateReminderInfo";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("CleanupAfterHours", model.CleanupAfterHours);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName);
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
