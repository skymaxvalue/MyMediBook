using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using Medicare.Application.Models.User;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class PatientController : Controller
    {
        private readonly IMediator _mediator;
        public PatientController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        [Route("CreatePatientDetails")]
        public async Task<IActionResult> CreatePatientDetails([FromBody] CreatePatientRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreatePatientCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "Patient Registered Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("UpdatePatientDetails")]
        public async Task<IActionResult> UpdatePatientDetails([FromBody] CreatePatientRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdatePatientCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "Patient Record updated Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("GetPatientByContact/{contactNo}")]
        public async Task<IActionResult> GetPatientByContact(string contactNo)
        {
            ApiResponse<PatientMasterModel> ApiResponse = new ApiResponse<PatientMasterModel>();
            PatientMasterModel response = new PatientMasterModel();
            response = await _mediator.Send(new GetPatientByContactQuery(contactNo));
            ApiResponse = new ApiResponse<PatientMasterModel>()
            {
                Data = response,
                StatusMessage = "Data Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("GetPatientById/{Id}")]
        public async Task<IActionResult> GetPatientById(int Id)
        {
            ApiResponse<PatientMasterModel> ApiResponse = new ApiResponse<PatientMasterModel>();
            PatientMasterModel response = new PatientMasterModel();
            response = await _mediator.Send(new GetPatientByIdQuery(Id));
            ApiResponse = new ApiResponse<PatientMasterModel>()
            {
                Data = response,
                StatusMessage = "Data Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

    }
}
