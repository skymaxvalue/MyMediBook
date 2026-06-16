using Dapper;
using Medicare.Application.Interfaces.IDepartment;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Department;
using Medicare.DAL.Persistence.Dapper;
namespace Medicare.DAL.Persistence.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public DepartmentRepository(DapperContext context, IErrorLogRepository errorLogRepository)
        {
            _context = context;
            _errorLog = errorLogRepository;
        }
        public async Task<List<DepartmentDataModel>> GetDepartmentListAsync()
        {
            string procName = "USP_GetDepartmentList";
            List<DepartmentDataModel> returnData = new List<DepartmentDataModel>();
            try
            {
                var param = new DynamicParameters();
                returnData = await _context.QueryStoredProcListAsync<DepartmentDataModel>(procName, param);
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
