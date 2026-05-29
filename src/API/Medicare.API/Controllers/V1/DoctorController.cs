using Medicare.Application.Features.Queries.Doctor;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Doctor;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

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
