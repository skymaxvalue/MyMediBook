using MediatR;
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

        [HttpGet]
        [Route("GetMyAppointments/{patientId}")]
        public async Task<IActionResult> GetMyAppointments(int patientId)
        {
            var response = await _mediator.Send(new GetMyAppointmentsQuery(patientId));
            return Ok(new ApiResponse<List<PatientAppointmentModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            });
        }

        [HttpGet]
        [Route("GetSpecialities")]
        public async Task<IActionResult> GetSpecialities(
            [FromQuery] string? doctorName,
            [FromQuery] string? departmentName)
        {
            var response = await _mediator.Send(
                new GetSpecialitiesQuery(doctorName, departmentName));
            return Ok(new ApiResponse<List<SpecialityModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            });
        }

        [HttpGet]
        [Route("GetAvailableAppointments")]
        public async Task<IActionResult> GetAvailableAppointments(
            [FromQuery] int doctorId,
            [FromQuery] DateTime requestedDate)
        {
            var response = await _mediator.Send(
                new GetAvailableAppointmentsQuery(doctorId, requestedDate));
            return Ok(new ApiResponse<List<AvailableAppointmentModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            });
        } 
    } 
}
