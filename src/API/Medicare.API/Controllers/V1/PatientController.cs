using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Interfaces.JwtToken;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Hospital;
using Medicare.Application.Models.JwtTokens;
using Medicare.Application.Models.Patient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : BaseApiController
    {
        private readonly IMediator _mediator;
        private readonly IJwtTokenRepository _jwtTokenRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IConfiguration _config;
        public PatientController(IMediator mediator, IJwtTokenRepository jwtTokenRepository, IRefreshTokenRepository refreshTokenRepository, IConfiguration config)
        {
            _mediator = mediator;
            _jwtTokenRepository = jwtTokenRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _config = config;
        }

        [HttpGet]
        [Route("Receptionist/GetPatientListById/{receptionistId}")]
        public async Task<IActionResult> GetRegisteredPatientList(int receptionistId)
        {
            List<PatientListResponseModel> response = new List<PatientListResponseModel>();
            response = await _mediator.Send(new GetPatientListByReceptionistIdQuery(receptionistId));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("UpdatePatientDetails")]
        public async Task<IActionResult> UpdatePatientDetails([FromBody] UpdatePatientRequestModel model)
        {
            model.PatientId = int.Parse(User.FindFirst("RefId")!.Value);
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdatePatientCommand(model));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetPatientById")]
        public async Task<IActionResult> GetPatientById()
        {
            int patientId = int.Parse(User.FindFirst("RefId")!.Value);
            PatientDetailModel response = new PatientDetailModel();
            response = await _mediator.Send(new GetPatientByIdQuery(patientId));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetPatientByContact/{contactNo}")]
        public async Task<IActionResult> GetPatientByContact([FromRoute] string contactNo)
        {
            PatientMasterModel response = new PatientMasterModel();
            response = await _mediator.Send(new GetPatientByContactQuery(contactNo));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetPatientProfileListById")]
        public async Task<IActionResult> GetPatientProfileListById()
        {
            int enrollmentId = int.Parse(User.FindFirst("activeEnrollmentId")!.Value);
            List<PatientProfileModel> response = new List<PatientProfileModel>();
            response = await _mediator.Send(new GetPatientProfileListByIdQuery(enrollmentId));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetPatientProfileByProfileId/{profileId}")]
        public async Task<IActionResult> GetPatientProfileByProfileId([FromRoute] int profileId)
        {
            PatientProfileModel response = new PatientProfileModel();
            response = await _mediator.Send(new GetPatientProfileByProfileIdQuery(profileId));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("SearchPatient")]
        public async Task<IActionResult> SearchPatient(SearchPatientRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            List<SearchPatientResponseModel> response = new List<SearchPatientResponseModel>();
            response = await _mediator.Send(new SearchPatientCommand(model));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("EnrollPatientInHospital")]
        public async Task<IActionResult> EnrollPatientInHospital([FromBody] EnrollPatientRequest model)
        {
            string userId = User.FindFirst("UserId")!.Value; 
            EnrollPatientResponse response = new EnrollPatientResponse();
            response = await _mediator.Send(new EnrollPatientInHospitalCommand(model.HospitalId, userId));
            
            if (response.IsSuccess != 1)        
                return HandleResponse(response);

            JwtPatientClaimModel tokenModel = new JwtPatientClaimModel()
            {
                UserId = Guid.Parse(User.FindFirst("UserId")!.Value),
                RefId = int.Parse(User.FindFirst("RefId")!.Value),
                UserType = User.FindFirst("UserType")!.Value,
                Email = User.FindFirst("Email")!.Value,
                Username = User.FindFirst("Username")!.Value ?? "",
                FullName = User.FindFirst("FullName")!.Value,
                RoleName = User.FindFirst("UserType")!.Value,

                ActiveHospitalId = response.HospitalId,
                ActiveTenantId = response.TenantId,
                ActiveEnrollmentId = response.EnrollmentId,
                PatientRefNo = response.PatientRefNo,
                TenantId = response.TenantId,
                AllEnrollments = response.Enrollments
            };

            var token = _jwtTokenRepository.GeneratePatientToken(tokenModel);

            string refreshToken = _jwtTokenRepository.GenerateRefreshToken();
            DateTime expiryDate = DateTime.UtcNow.AddDays(
                int.Parse(_config["JwtSettings:RefreshTokenExpDays"]));

            await _refreshTokenRepository.SaveRefreshTokenAsync(new JwtRefreshTokenModel
            {
                UserId = Guid.Parse(userId),
                UserType = User.FindFirst("UserType")!.Value,
                RefreshToken = refreshToken,
                ExpiryDate = expiryDate
            });

            return HandleLoginResponse(response, token, refreshToken);
        }

        [HttpPost]
        [Route("SwitchHospital")]
        public async Task<IActionResult> SwitchHospital([FromBody] SwitchHospitalRequest model)
        {
            string userId = User.FindFirst("UserId")!.Value;
            SwitchHospitalResponse response = new SwitchHospitalResponse();
            response = await _mediator.Send(new SwitchHospitalCommand(model.HospitalId, userId));
            
            if (response.IsSuccess != 1)  
                return HandleResponse(response);
            
            var token =  _jwtTokenRepository.GeneratePatientToken(new JwtPatientClaimModel
            {
                UserId = Guid.Parse(userId),
                RefId = int.Parse(User.FindFirst("RefId")!.Value),
                UserType = User.FindFirst("UserType")!.Value,
                Email = User.FindFirst("Email")!.Value,
                Username = User.FindFirst("Username")!.Value,
                FullName = User.FindFirst("FullName")!.Value,
                RoleName = User.FindFirst("UserType")!.Value,

                ActiveHospitalId = response.HospitalId,
                ActiveTenantId = response.TenantId,
                ActiveEnrollmentId = response.EnrollmentId,
                PatientRefNo = response.PatientRefNo,
                TenantId = response.TenantId,
                AllEnrollments = response.Enrollments
            });

            string refreshToken = _jwtTokenRepository.GenerateRefreshToken();
            DateTime expiryDate = DateTime.UtcNow.AddDays(int.Parse(_config["JwtSettings:RefreshTokenExpDays"]));

            var refreshTokenData = new JwtRefreshTokenModel
            {
                UserId = Guid.Parse(userId),
                UserType = User.FindFirst("UserType")!.Value,
                RefreshToken = refreshToken,
                ExpiryDate = expiryDate
            };

            await _refreshTokenRepository.SaveRefreshTokenAsync(refreshTokenData);


            return HandleLoginResponse(response, token, refreshToken);
        }
    }
}
