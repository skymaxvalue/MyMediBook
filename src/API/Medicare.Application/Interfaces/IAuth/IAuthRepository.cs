using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;

namespace Medicare.Application.Interfaces.IAuthRepository
{
    public interface IAuthRepository
    {
        Task<AuthDetailModel> GetPasswordByUsernameAsync(string Username);
        Task<ResponseModel> RegisterUserAsync(UserModel Model);
        Task<ResponseModel> SaveOtpAsync(OtpDetailModel model);
        Task<OtpDetailModel> GetOtpDetailAsync(string email);
        Task<ResponseModel> ClearOtpAsync(string email);
        Task<ResponseModel> IncrementOtpAttemptsAsync(string email);
    }
}
