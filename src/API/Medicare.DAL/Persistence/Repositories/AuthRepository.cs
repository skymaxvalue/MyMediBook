using Dapper;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public AuthRepository(DapperContext context, IErrorLogRepository errorLog) 
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<AuthDetailModel> GetPasswordByUsernameAsync(string Username)
        {
            string procName = "USP_GetUserPassword";
            AuthDetailModel returnData = new AuthDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Username", Username);
                returnData  = await _context.QuerySingleStoredProcAsync<AuthDetailModel>(procName, param);

            }catch (Exception ex)
            {
                string path = "USP_GetUserPassword";
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = path,
                    Error_Trace = ex.StackTrace
                });
            }

            return returnData;
        }
    }
}
