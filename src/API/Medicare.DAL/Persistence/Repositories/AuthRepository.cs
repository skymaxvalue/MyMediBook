using Dapper;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
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
            return returnData;
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

        public async Task<ResponseModel> IncrementOtpAttemptsAsync(string email)
        {
            string procName = "USP_UpdateOtpAttempts";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);

            }
            catch (Exception ex)
            {
                string path = "USP_UpdateOtpAttempts";
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

        public async Task<ResponseModel> ClearOtpAsync(string email)
        {
            string procName = "USP_ClearOtp";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);

            }
            catch (Exception ex)
            {
                string path = "USP_ClearOtp";
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

        public async Task<ResponseModel> SaveOtpAsync(OtpDetailModel model)
        {
            string procName = "USP_SaveOtp";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("UserId", model.UserId);
                param.Add("Email", model.Email);
                param.Add("OtpHash", model.OtpHash);
                param.Add("OtpSalt", model.OtpSalt);
                param.Add("Expiry", model.Expiry);
                param.Add("Attempts", model.Attempts);
                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);

            }
            catch (Exception ex)
            {
                string path = "USP_SaveOtp";
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
        public async Task<OtpDetailModel> GetOtpDetailAsync(string email)
        {
            string procName = "USP_GetOtpDetail";
            OtpDetailModel returnData = new OtpDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
                returnData = await _context.QuerySingleStoredProcAsync<OtpDetailModel>(procName, param);

            }
            catch (Exception ex)
            {
                string path = "USP_GetOtpDetail";
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
