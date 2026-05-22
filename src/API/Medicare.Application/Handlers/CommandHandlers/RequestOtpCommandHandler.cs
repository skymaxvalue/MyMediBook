using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IEmail;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class RequestOtpCommandHandler : IRequestHandler<RequestOtpCommand, ResponseModel>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IEmailService _emailService;  

        public RequestOtpCommandHandler(IAuthRepository authRepository, IEmailService emailService)
        {
            _authRepository = authRepository;
            _emailService = emailService;
        }

        public async Task<ResponseModel> Handle(RequestOtpCommand request, CancellationToken ct)
        {
            var rawOtp = GenerateOtp();

            using var hmac = new HMACSHA512();
            var otpSalt = hmac.Key;
            var otpHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawOtp));

            var expiry = DateTime.UtcNow.AddMinutes(5);

            var otpModel = new OtpDetailModel
            {
                Email = request.Model.Email,
                OtpHash = otpHash,
                OtpSalt = otpSalt,
                Expiry = expiry,
                Attempts = 0
            };

            await _authRepository.SaveOtpAsync(otpModel);

            //await _emailService.SendOtpEmailAsync(request.Model.Email, rawOtp);

            return new ResponseModel
            {
            };
        }

        private static string GenerateOtp()
        {
            // Cryptographically secure random 6-digit OTP
            var bytes = RandomNumberGenerator.GetBytes(4);
            var number = BitConverter.ToUInt32(bytes, 0) % 1_000_000;
            return number.ToString("D6");
        }
    }
}
