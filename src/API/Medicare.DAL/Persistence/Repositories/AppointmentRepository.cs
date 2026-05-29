using Dapper;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ErrorLog;
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

                returnData = await _context.QueryStoredProcListAsync<AvailableAppointmentModel> (procName, param);
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
