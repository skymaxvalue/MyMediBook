using Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public UserRepository(DapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }

        public async Task<UserInfoDataModel> GetUserInfoAsync(string Username)
        {
            string procName = "USP_GetUserInfo";
            UserInfoDataModel returnData = new UserInfoDataModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Username", Username);

                returnData = await _context.QuerySingleStoredProcAsync<UserInfoDataModel>(procName, param);
            }
            catch (Exception ex) 
            {
                string path = "USP_GetUserInfo";
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

        public async Task<ResponseModel> RegisterUserAsync(UserModel model)
        {
            string procName = "USP_UserRegister";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Username", model.Username);
                param.Add("PasswordHash", model.PasswordHash);
                param.Add("PasswordSalt", model.PasswordSalt);
                param.Add("FirstName", model.FirstName);
                param.Add("LastName", model.LastName);
                param.Add("PhoneNumber", model.PhoneNumber);
                param.Add("Email", model.Email);
                param.Add("RoleId", model.RoleId);
                param.Add("DepartmentId", model.DepartmentId);
                param.Add("CreatedBy", model.CreatedBy);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
            }
            catch (Exception ex) 
            {
                string path = "USP_UserRegister";
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = path,
                    Error_Trace = ex.StackTrace
                });
            }
            //TODO : Use aggregate factory function
            return returnData;
        }

        public async Task<UserInfoDataModel> GetUserByIdAsync(int Id)
        {
            string procName = "USP_GetUserById";
            UserInfoDataModel returnData = new UserInfoDataModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("UserId", Id);

                returnData = await _context.QuerySingleStoredProcAsync<UserInfoDataModel>(procName, param);

            }
            catch (Exception ex) 
            {
                string path = "USP_GetUserById";
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
