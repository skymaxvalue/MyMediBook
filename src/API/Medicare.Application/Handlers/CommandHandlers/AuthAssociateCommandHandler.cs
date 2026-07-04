using MediatR;
using Medicare.Application.Features.Commands.Associate;
using Medicare.Application.Interfaces.IAssociate;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Models.Associate;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class AuthAssociateCommandHandler : IRequestHandler<AuthAssociateCommand, AssociateDetailModel>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IAssociateRepository _associateRepository;
        public readonly PasswordHelper _passwordHelper;
        public AuthAssociateCommandHandler(IAuthRepository authRepository, IAssociateRepository associateRepository, PasswordHelper passwordHelper)
        {
            _authRepository = authRepository;
            _associateRepository = associateRepository;
            _passwordHelper = passwordHelper;
        }
        public async Task<AssociateDetailModel> Handle(AuthAssociateCommand request, CancellationToken cancellationToken)
        {
            var user = await _authRepository.GetPasswordByUsernameAsync(request.model.Username);

            if (user.PasswordHash == null)
            {
                return new AssociateDetailModel
                {
                    IsSuccess = 0,
                    ResponseMessage = "User not found."
                };
            }

            bool isPasswordValid = _passwordHelper.VerifyPassword(request.model.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return new AssociateDetailModel
                {
                    IsSuccess = 0,
                    ResponseMessage = "Invalid password."
                };
            }

            var result = await _associateRepository.GetAssociateInfoByUsername(request.model.Username);

            return result;
        }
    }
}
