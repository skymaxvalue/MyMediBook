using Dapper;
using Medicare.Application.Interfaces.IDoctor;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Doctor;
using Medicare.Application.Models.Speciality;
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
        public async Task<List<DoctorAvailabilityModel>> GetDoctorAvailabilitiesAsync(int associateId)
        {
            string procName = "USP_GetDoctorAvailabilities";
            List<DoctorAvailabilityModel> returnData = new List<DoctorAvailabilityModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", associateId);

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

        public async Task<List<DoctorItemModel>> GetDoctorListAsync()
        {
            string procName = "USP_GetDoctorList";
            List<DoctorItemModel> returnData = new List<DoctorItemModel>();
            try
            {
                returnData = await _context.QueryStoredProcListAsync<DoctorItemModel>(procName);
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

        public async Task<List<SpecialityDataModel>> GetDoctorSpecialityListAsync(string? doctorName, string? departmentName)
        {
            string procName = "USP_GetSpecialities";
            List<SpecialityDataModel> returnData = new List<SpecialityDataModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("DoctorName", doctorName);
                param.Add("DepartmentName", departmentName);

                returnData = await _context.QueryStoredProcListAsync<SpecialityDataModel>(procName, param);
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
