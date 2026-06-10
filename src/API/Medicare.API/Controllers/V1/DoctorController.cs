using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Features.Queries.Doctor;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Doctor;
using Microsoft.AspNetCore.Mvc;
using System.Net;
namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class DoctorController : Controller
    {
        private readonly IMediator _mediator;
        public DoctorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetDoctorList")]
        public async Task<IActionResult> GetDoctorList()
        {
            ApiResponse<List<DoctorCategoryModel>> ApiResponse = new ApiResponse<List<DoctorCategoryModel>>();
            List<DoctorCategoryModel> response = new List<DoctorCategoryModel>();
            response = await _mediator.Send(new GetDoctorListQuery());
            ApiResponse = new ApiResponse<List<DoctorCategoryModel>>()
            {
                Data = response,
                StatusMessage = "Data fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetSpecialities")]
        public async Task<IActionResult> GetSpecialities(
            [FromQuery] string? doctorName,
            [FromQuery] string? departmentName)
        {
            ApiResponse<List<SpecialityModel>> ApiResponse = new ApiResponse<List<SpecialityModel>>();
            List<SpecialityModel> response = new List<SpecialityModel>();
            response = await _mediator.Send(new GetSpecialitiesQuery(doctorName, departmentName));
            ApiResponse = new ApiResponse<List<SpecialityModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }


        [HttpGet]
        [Route("GetDoctorAvailabilities/{doctorId}")]
        public async Task<IActionResult> GetDoctorAvailabilities(int doctorId)
        {
            ApiResponse<List<DoctorAvailabilityModel>> ApiResponse = new ApiResponse<List<DoctorAvailabilityModel>>();
            List<DoctorAvailabilityModel> response = new List<DoctorAvailabilityModel>();
            response = await _mediator.Send(new GetDoctorAvailabilitiesQuery(doctorId));
            ApiResponse = new ApiResponse<List<DoctorAvailabilityModel>>()
            {
                Data = response,
                StatusMessage = "Data fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
