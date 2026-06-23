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
    public class AppointmentController : BaseApiController
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
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAppointmentCommand(model));
            return HandleResponse(response);
        }

        [HttpPut]
        [Route("UpdateAppointmentDetail")]
        public async Task<IActionResult> UpdateAppointmentDetail(UpdateAppointmentRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateAppointmentCommand(model));
            return HandleResponse(response);
        }

        [HttpDelete]
        [Route("CancelAppointmentById")]
        public async Task<IActionResult> CancelAppointmentById(
            [FromQuery] int appointmentId,
            [FromQuery] int patientId
            )
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new DeleteAppointmentCommand(appointmentId, patientId));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetAvailableAppointments")]
        public async Task<IActionResult> GetAvailableAppointments([FromQuery] int associateId)
        {
            List<AvailableAppointmentModel> response = new List<AvailableAppointmentModel>();
            response = await _mediator.Send(new GetAvailableAppointmentsQuery(associateId));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetMyAppointments/{patientId}")]
        public async Task<IActionResult> GetMyAppointments(int patientId)
        {
            List<PatientAppointmentModel> response = new List<PatientAppointmentModel>();
            response = await _mediator.Send(new GetMyAppointmentsQuery(patientId));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetAppointmentById/{AppointmentId}")]
        public async Task<IActionResult> GetAppointmentById([FromRoute] int AppointmentId)
        {
            AppointmentDetailModel response = new AppointmentDetailModel();
            response = await _mediator.Send(new GetAppointmentByIdQuery(AppointmentId));
            return HandleResponse(response);
        }
    } 
}
