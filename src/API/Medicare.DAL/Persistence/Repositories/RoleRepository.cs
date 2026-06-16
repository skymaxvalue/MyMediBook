using Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.IRoles;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Role;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public RoleRepository(DapperContext context, IErrorLogRepository errorLogRepository)
        {
            _context = context;
            _errorLog = errorLogRepository;
        }
        public async Task<List<RoleDataModel>> GetRoleListAsync()
        {
            string procName = "USP_GetRoleList";
            List<RoleDataModel> returnData = new List<RoleDataModel>();
            try
            {
                var param = new DynamicParameters();
                returnData = await _context.QueryStoredProcListAsync<RoleDataModel>(procName, param);
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
