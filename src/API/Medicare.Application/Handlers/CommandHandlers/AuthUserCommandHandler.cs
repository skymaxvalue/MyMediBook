using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.User;
using System.Security.Cryptography;
using System.Text;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class AuthUserCommandHandler : IRequestHandler<AuthUserCommand, UserInfoDataModel>
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthRepository _authRepository;

        public AuthUserCommandHandler(IUserRepository userRepository, IAuthRepository authRepository)
        {
            _userRepository = userRepository;
            _authRepository = authRepository;
        }

        public async Task<UserInfoDataModel> Handle(AuthUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _authRepository.GetPasswordByUsernameAsync(request.Model.Username);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            bool isPasswordValid = VerifyPassword(request.Model.Password, user.PasswordHash, user.PasswordSalt);

            if (!isPasswordValid)
            {
                throw new Exception("Invalid Password");
            }

            var result = await _userRepository.GetUserInfoAsync(request.Model.Username);

            return result;
        }
        private bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return computedHash.SequenceEqual(storedHash);
        }
    }
}
