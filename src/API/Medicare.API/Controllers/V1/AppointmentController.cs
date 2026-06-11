using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AppointmentController : Controller
    {
        private readonly IMediator _mediator;
        public AppointmentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CreateAppointment")]
        public async Task<IActionResult> CreateAppointment(AppointmentMasterModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAppointmentCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPut]
        [Route("UpdateAppointmentDetail")]
        public async Task<IActionResult> UpdateAppointmentDetail(UpdateAppointmentRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateAppointmentCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpDelete]
        [Route("CancelAppointmentById")]
        public async Task<IActionResult> CancelAppointmentById(
            [FromQuery] int appointmentId,
            [FromQuery] int patientId
            )
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new DeleteAppointmentCommand(appointmentId, patientId));
            ApiResponse = new ApiResponse<ResponseModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetAvailableAppointments")]
        public async Task<IActionResult> GetAvailableAppointments([FromQuery] int doctorId)
        {
            ApiResponse<List<AvailableAppointmentModel>> ApiResponse = new ApiResponse<List<AvailableAppointmentModel>>();
            List<AvailableAppointmentModel> response = new List<AvailableAppointmentModel>();
            response = await _mediator.Send(new GetAvailableAppointmentsQuery(doctorId));
            ApiResponse = new ApiResponse<List<AvailableAppointmentModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetMyAppointments/{patientId}")]
        public async Task<IActionResult> GetMyAppointments(int patientId)
        {
            ApiResponse<List<PatientAppointmentModel>> ApiResponse = new ApiResponse<List<PatientAppointmentModel>>();
            List<PatientAppointmentModel> response = new List<PatientAppointmentModel>();
            response = await _mediator.Send(new GetMyAppointmentsQuery(patientId));
            ApiResponse = new ApiResponse<List<PatientAppointmentModel>>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetAppointmentById/{AppointmentId}")]
        public async Task<IActionResult> GetAppointmentById([FromRoute] int AppointmentId)
        {
            ApiResponse<AppointmentDetailModel> ApiResponse = new ApiResponse<AppointmentDetailModel>();
            AppointmentDetailModel response = new AppointmentDetailModel();
            response = await _mediator.Send(new GetAppointmentByIdQuery(AppointmentId));
            ApiResponse = new ApiResponse<AppointmentDetailModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    } 
}
