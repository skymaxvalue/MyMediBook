using Medicare.Application.Models.Associate;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;

namespace Medicare.Application.Interfaces.IAuthRepository
{
    public interface IAuthRepository
    {
        Task<ResponseModel> RegisterUserAsync(UserModel Model);
        Task<AssociateResponseModel> RegisterAssociateAsync(RegisterAssociateModel model);
        Task<AuthDetailModel> GetPasswordByUsernameAsync(string username);
        Task<ResponseModel> SendOtpEmailAsync(string toEmail, string toName, string otpCode);
        Task<ResponseModel> SaveOtpAsync(OtpDetailModel model);
        Task<OtpDetailModel> GetOtpDetailAsync(string email);
        Task<ResponseModel> ClearOtpAsync(string email);
        Task<ResponseModel> IncrementOtpAttemptsAsync(string email);
        Task<ResponseModel> ResetFailedAttemptsAsync(string email);
    }
}
