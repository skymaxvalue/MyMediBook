using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Features.Commands.Claim;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.Claim;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
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
            model.PatientId = int.Parse(User.FindFirst("RefId")!.Value);
            model.EnrollmentId = int.Parse(User.FindFirst("ActiveEnrollmentId")!.Value);
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAppointmentCommand(model));
            return HandleResponse(response);
        }

        [HttpPut]
        [Route("UpdateAppointmentSchedule")]
        public async Task<IActionResult> UpdateAppointmentSchedule(UpdateAppointmentScheduleRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateAppointmentScheduleCommand(model));
            return HandleResponse(response);
        }

        [HttpDelete]
        [Route("CancelAppointmentById")]
        public async Task<IActionResult> CancelAppointmentById(CancelAppointmentScheduleRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new DeleteAppointmentCommand(model));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetAvailableAppointments/{associateId}")]
        public async Task<IActionResult> GetAvailableAppointments([FromQuery] int associateId)
        {
            var tenantId = Guid.Parse(User.FindFirst("TenantId")!.Value);
            List<AvailableAppointmentModel> response = new List<AvailableAppointmentModel>();
            response = await _mediator.Send(new GetAvailableAppointmentsQuery(associateId));
            return HandleListResponse(response);
        }
        
        [HttpGet]
        [Route("GetAppointmentById/{appointmentId}")]
        public async Task<IActionResult> GetAppointmentById([FromRoute] int appointmentId)
        {
            AppointmentDetailModel response = new AppointmentDetailModel();
            response = await _mediator.Send(new GetAppointmentByIdQuery(appointmentId));
            return HandleResponse(response);
        }
        
        [HttpGet]
        [Route("Patient/GetMyAppointmentList")]
        public async Task<IActionResult> GetMyAppointmentListByPatientId()
        {
            int patientId = int.Parse(User.FindFirst("RefId")!.Value);
            List<PatientAppointmentModel> response = new List<PatientAppointmentModel>();
            response = await _mediator.Send(new GetMyAppointmentListByPatientIdQuery(patientId));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("Doctor/GetMyAppointmentList")]
        public async Task<IActionResult> GetMyAppointmentListByAssociateId(DataRequestModel model)
        {
            model.AssociateId = int.Parse(User.FindFirst("RefId")!.Value);
            List<PatientProfileModel> response = new List<PatientProfileModel>();
            response = await _mediator.Send(new GetMyAppointmentListByAssociateIdQuery(model));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("Associate/UpdateConsultationStatus")]
        public async Task<IActionResult> UpdateConsultationStatus(UpdateConsultationStatusRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateConsultationStatusCommand(model));
            return HandleResponse(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("Patient/ConfirmAppointmentStatus/{token}")]
        public async Task<IActionResult> ConfirmAppointmentStatus([FromQuery] string token)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new ConfirmAppointmentStatusQuery(token));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("Associate/{appointmentId}/Copay")]
        public async Task<IActionResult> CollectCopay(CollectCopayRequest request)
        {
            CollectCopayResponse response = new CollectCopayResponse();
            response = await _mediator.Send(new CollectCopayCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("Receptionist/GetAppointmentList")]
        public async Task<IActionResult> GetAppointmentList(DataRequestFilterModel model)
        {
            List<AppointmentDetailModel> response = new List<AppointmentDetailModel>();
            response = await _mediator.Send(new GetAppointmentListQuery(model));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("Receptionist/UpdateCheckedInStatus")]
        public async Task<IActionResult> UpdateCheckedInStatus(UpdateCheckedInStatusRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateCheckedInStatusCommand(model));
            return HandleResponse(response);
        }
    }
}
