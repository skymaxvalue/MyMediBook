using Dapper;
using Medicare.Application.Interfaces.IDoctor;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Doctor;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public DoctorRepository(DapperContext context, IErrorLogRepository errorLogRepository) 
        {
            _context = context;
            _errorLog = errorLogRepository;
        }
        public async Task<List<DoctorAvailabilityModel>> GetDoctorAvailabilitiesAsync(int doctorId)
        {
            string procName = "USP_GetDoctorAvailabilities";
            List<DoctorAvailabilityModel> returnData = new List<DoctorAvailabilityModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("DoctorId", doctorId);

                returnData = await _context.QueryStoredProcListAsync<DoctorAvailabilityModel>(procName, param);
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
