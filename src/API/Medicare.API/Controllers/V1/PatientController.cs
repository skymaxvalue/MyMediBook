using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class PatientController : BaseApiController
    {
        private readonly IMediator _mediator;
        public PatientController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("LoginPatient")]
        public async Task<IActionResult> LoginPatient([FromBody] PatientAuthModel model)
        {
            PatientDetailModel response = new PatientDetailModel();
            response = await _mediator.Send(new AuthPatientCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("CreatePatientDetails")]
        public async Task<IActionResult> CreatePatientDetails([FromBody] CreatePatientRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreatePatientCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("UpdatePatientDetails")]
        public async Task<IActionResult> UpdatePatientDetails([FromBody] UpdatePatientRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdatePatientCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("GetPatientById/{Id}")]
        public async Task<IActionResult> GetPatientById(int Id)
        {
            PatientMasterModel response = new PatientMasterModel();
            response = await _mediator.Send(new GetPatientByIdQuery(Id));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("GetPatientByContact/{contactNo}")]
        public async Task<IActionResult> GetPatientByContact(string contactNo)
        {
            PatientMasterModel response = new PatientMasterModel();
            response = await _mediator.Send(new GetPatientByContactQuery(contactNo));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetPatientProfileListById/{patientId}")]
        public async Task<IActionResult> GetPatientProfileListById(int patientId)
        {
            List<PatientProfileModel> response = new List<PatientProfileModel>();
            response = await _mediator.Send(new GetPatientProfileListByIdQuery(patientId));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetPatientProfileByProfileId/{profileId}")]
        public async Task<IActionResult> GetPatientProfileByProfileId(int profileId)
        {
            PatientProfileModel response = new PatientProfileModel();
            response = await _mediator.Send(new GetPatientProfileByProfileIdQuery(profileId));
            return HandleResponse(response);
        }
    }
}
