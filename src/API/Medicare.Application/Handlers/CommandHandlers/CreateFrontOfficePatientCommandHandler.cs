using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateFrontOfficePatientCommandHandler : IRequestHandler<CreateFrontOfficePatientCommand, CreateFrontOfficePatientResponseModel>
    {
        private readonly IAuthRepository _authRepository;
        private readonly PasswordHelper _passwordHelper;
        public CreateFrontOfficePatientCommandHandler(IAuthRepository authRepository, PasswordHelper passwordHelper)
        {
            _authRepository = authRepository;
            _passwordHelper = passwordHelper;
        }
        public async Task<CreateFrontOfficePatientResponseModel> Handle(CreateFrontOfficePatientCommand request, CancellationToken cancellationToken)
        {
            var plainText = _passwordHelper.GenerateTempPassword();

            var passwordHash = _passwordHelper.HashPassword(plainText);

            request.model.Password = passwordHash;
            
            return await _authRepository.CreateFrontOfficePatientDetails(request.model);
        }
    }
}
