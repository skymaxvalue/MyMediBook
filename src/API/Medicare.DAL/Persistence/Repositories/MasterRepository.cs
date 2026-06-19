using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.Master;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.MasterModels;
using Medicare.Application.Models.Speciality;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class MasterRepository : IMasterRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public MasterRepository(DapperContext context, IErrorLogRepository errorLogRepository)
        {
            _context = context;
            _errorLog = errorLogRepository;
        }

        public async Task<List<WeekDaysModel>> GetWeekDaysListAsync()
        {
            string procName = "USP_GetWeekDays";
            List<WeekDaysModel> returnData = new List<WeekDaysModel>();
            try
            {
                returnData = await _context.QueryStoredProcListAsync<WeekDaysModel>(procName);
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
        public async Task<List<SpecialityTypeModel>> GetSpecialityTypeListAsync()
        {
            string procName = "USP_GetSpecialityTypeList";
            List<SpecialityTypeModel> returnData = new List<SpecialityTypeModel>();
            try
            {
                returnData = await _context.QueryStoredProcListAsync<SpecialityTypeModel>(procName);
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
