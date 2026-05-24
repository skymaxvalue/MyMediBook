using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Models.CommonModels.ResponseModel;
using System.Security.Cryptography;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, ResponseModel>
    {
        private const int MaxAttempts = 3;
        private readonly IAuthRepository _authRepository;

        public VerifyOtpCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<ResponseModel> Handle(VerifyOtpCommand request, CancellationToken ct)
        {
            var otpDetail = await _authRepository.GetOtpDetailAsync(request.model.Email);

            if (otpDetail is null)
                throw new Exception("No OTP request found for this email.");

            if (otpDetail.OtpAttempts >= MaxAttempts)
                throw new Exception("OTP locked. Please request a new one.");

            if (DateTime.UtcNow > otpDetail.Expiry)
                throw new Exception("OTP has expired. Please request a new one.");

            using var hmac = new HMACSHA512(otpDetail.OtpSalt);
            var computedHash = hmac.ComputeHash(
                System.Text.Encoding.UTF8.GetBytes(request.model.OtpCode)
            );

            if (!CryptographicOperations.FixedTimeEquals(computedHash, otpDetail.OtpHash))
            {
                await _authRepository.IncrementOtpAttemptsAsync(otpDetail.Email);
                throw new Exception("Invalid OTP.");
            }

            await _authRepository.ClearOtpAsync(request.model.Email);

            return new ResponseModel()
            {
                Status = 1,
                IsSuccess = 1,
                ResponseMessage = "OTP verified successfully",
                ResponseId = 0
            };
        }
    }
}
