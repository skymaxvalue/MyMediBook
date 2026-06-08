using Dapper;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.DAL.Persistence.Dapper;

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

        public async Task<List<PatientAppointmentModel>> GetMyAppointmentsAsync(int patientId)
        {
            string procName = "USP_GetMyAppointments";
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

        public async Task<List<SpecialityModel>> GetSpecialitiesAsync(string? doctorName, string? departmentName)
        {
            string procName = "USP_GetSpecialities";
            List<SpecialityModel> returnData = new List<SpecialityModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("DoctorName", doctorName);
                param.Add("DepartmentName", departmentName);

                returnData = await _context.QueryStoredProcListAsync<SpecialityModel>(procName, param);
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

        public async Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(
            int doctorId, DateTime requestedDate)
        {
            string procName = "USP_GetAvailableAppointments";
            List<AvailableAppointmentModel> returnData = new List<AvailableAppointmentModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("DoctorId", doctorId);
                param.Add("RequestedDate", requestedDate.Date);

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

        public async Task<AppointmentDetailModel> GetAppointmentById(int appointmentId)
        {
            string procName = "USP_GetAppointmentById";
            AppointmentDetailModel returnData = new AppointmentDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", appointmentId);

                returnData = await _context.QuerySingleStoredProcAsync<AppointmentDetailModel>(procName, param);
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
            string procName = "USP_CreateAppointment";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", model.PatientId);
                param.Add("DoctorId", model.DoctorId);
                param.Add("SlotId", model.SlotId);
                param.Add("AppointmentDate", model.AppointmentDate);
                param.Add("TimeSlot", model.TimeSlot);
                param.Add("VisitPurpose", model.VisitPurpose);
                param.Add("VisitType", model.VisitType);
                param.Add("OtpMethod", model.OtpMethod);

                param.Add("Insurance", model.Insurance);
                param.Add("Provider", model.InsuranceData?.Provider);
                param.Add("Policy", model.InsuranceData?.Policy);
                param.Add("GroupId", model.InsuranceData?.GroupId);
                param.Add("HolderName", model.InsuranceData?.HolderName);
                param.Add("InsuranceAddress", model.InsuranceData?.Address);

                param.Add("PaymentType", model.PaymentData?.PaymentType);
                param.Add("TransactionId", model.PaymentData?.TransactionId);
                param.Add("Amount", model.PaymentData?.Amount);
                param.Add("PaymentStatus", model.PaymentData?.PaymentStatus);

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

        public async Task<ResponseModel> UpdateAppointmentDetailAsync(UpdateAppointmentRequestModel model)
        {
            string procName = "USP_UpdateAppointmentDetails";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("PatientId", model.PatientId);
                param.Add("DoctorId", model.DoctorId);
                param.Add("SlotId", model.SlotId);
                param.Add("TimeSlot", model.TimeSlot);
                param.Add("VisitPurpose", model.VisitPurpose);
                param.Add("AppointmentDate", model.AppointmentDate);
                param.Add("UpdatedBy", model.UpdatedBy);

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

        public async Task<ResponseModel> CancelAppointmentByIdAsync(int appointmentId)
        {
            string procName = "USP_CancelAppointment";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AppointmentId", appointmentId);

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
