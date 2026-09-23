using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Interfaces.IAssociate;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Interfaces.JwtToken;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.Hospital;
using Medicare.Application.Models.JwtTokens;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class AuthCommandHandler : IRequestHandler<AuthCommand, AuthResultModel>
    {
        private readonly IAuthRepository _authRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IAssociateRepository _associateRepository;
        private readonly IJwtTokenRepository _jwtTokenRepository;
        private readonly PasswordHelper _passwordHelper;
        public AuthCommandHandler(IAuthRepository authRepository, PasswordHelper passwordHelper, IPatientRepository patientRepository, IAssociateRepository associateRepository, IJwtTokenRepository jwtTokenRepository)
        {
            _authRepository = authRepository;
            _passwordHelper = passwordHelper;
            _patientRepository = patientRepository;
            _associateRepository = associateRepository;
            _jwtTokenRepository = jwtTokenRepository;
        }
        public async Task<AuthResultModel> Handle(AuthCommand request, CancellationToken cancellationToken)
        {
            var userLoginCreds = await _authRepository.GetPasswordByUsernameAsync(request.model.Username);

            if (userLoginCreds.PasswordHash == null)
            {
                return new AuthResultModel
                {
                    IsSuccess = 0,
                    Status = 0,
                    ResponseMessage = "User not found."
                };
            }

            bool isPasswordValid = _passwordHelper.VerifyPassword(request.model.Password, userLoginCreds.PasswordHash);

            if (!isPasswordValid)
            {
                return new AuthResultModel
                {
                    IsSuccess = 0,
                    Status = 0,
                    ResponseMessage = "Invalid password."
                };
            }

            return userLoginCreds.UserType switch
            {
                "Patient" => await HandlePatientLoginAsync(userLoginCreds, request.model.Username),
                "Associate" => await HandleAssociateLoginAsync(request.model.Username),
                _ => new AuthResultModel
                {
                    IsSuccess = 0,
                    Status = 0,
                    ResponseMessage = "Account Does not Exist."
                }
            };
        }
        private async Task<AuthResultModel> HandlePatientLoginAsync(AuthDetailModel creds, string username)
        {
            var enrollments = await _patientRepository.GetEnrollmentsAsync(creds.UserId);

            var activeHospital = enrollments.FirstOrDefault(e => e.IsActive) ?? enrollments.FirstOrDefault();

            var result = await _patientRepository.GetPatientInfoByUsername(username);

            if (activeHospital == null)
            {
                return new AuthResultModel
                {
                    Status = 1,
                    IsSuccess = 1,
                    ResponseMessage = "Login successful. Please select a hospital.",
                    NeedsHospitalSelection = true,
                    UserId = result.UserId,
                    RefId = result.PatientId,
                    PatientId = result.PatientId,
                    UserType = result.UserType,
                    RoleName = result.RoleName,
                    FullName = $"{result.FirstName} {result.MiddleName} {result.LastName}".Trim(),
                    Email = result.Email,
                    Username = result.Username,
                };
            }

            return new AuthResultModel
            {
                IsSuccess = 1,
                Status = 1,
                ResponseMessage = "Login Successful",
                UserId = result.UserId,
                RefId = result.PatientId,
                PatientId = result.PatientId,
                UserType = result.UserType,
                RoleName = result.RoleName,
                FullName = $"{result.FirstName} {result.MiddleName} {result.LastName}".Trim(),
                Email = result.Email,
                Username = result.Username,
                ActiveHospitalId = activeHospital.HospitalId,
                ActiveTenantId = activeHospital.TenantId,
                ActiveEnrollmentId = activeHospital.EnrollmentId,
                PatientRefNo = activeHospital.PatientRefNo,
                Enrollments = enrollments.ToList(),
            };
        }
        private async Task<AuthResultModel> HandleAssociateLoginAsync(string username)
        {
            var result = await _associateRepository.GetAssociateInfoByUsername(username);

            return new AuthResultModel
            {
                IsSuccess = 1,
                Status = 1,
                ResponseMessage = "Login Successful",
                UserId = result.UserId,
                RefId = result.AssociateId,
                UserType = result.UserType,
                RoleName = result.RoleName,
                FullName = $"{result.FirstName} {result.MiddleName} {result.LastName}".Trim(),
                Email = result.EmailId,
                EmployeeId = result.EmployeeId,
                DepartmentName = result.DepartmentName,
                DesignationName = result.DesignationName,
                TenantId = result.TenantId,
                ActiveHospitalId = result.ActiveHospitalId,
                ActiveTenantId = result.ActiveTenantId
            };
        }
        private string GenerateLimitedToken(AuthDetailModel creds)
        {
            JwtPatientClaimModel model = new()
            {
                UserId = creds.UserId,
                PatientId = creds.RefId,
                Email = creds.Email,
                ActiveTenantId = Guid.Empty,
                PatientRefNo = string.Empty,
                ActiveEnrollmentId = 0,
                ActiveHospitalId = 0,
                AllEnrollments = []
            };
            return _jwtTokenRepository.GeneratePatientToken(model);
        }
    }
}
