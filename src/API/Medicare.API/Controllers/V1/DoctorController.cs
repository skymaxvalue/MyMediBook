using MediatR;
using Medicare.Application.Features.Queries.Doctor;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Doctor;
using Medicare.Application.Models.Speciality;
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
        [Route("GetDoctorSpecialityList")]
        public async Task<IActionResult> GetDoctorSpecialityList(
            [FromQuery] string? doctorName,
            [FromQuery] string? departmentName)
        {
            ApiResponse<List<DoctorSpecialityDataModel>> ApiResponse = new ApiResponse<List<DoctorSpecialityDataModel>>();
            List<DoctorSpecialityDataModel> response = new List<DoctorSpecialityDataModel>();
            response = await _mediator.Send(new GetDoctorSpecialityListQuery(doctorName, departmentName));
            ApiResponse = new ApiResponse<List<DoctorSpecialityDataModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }


        [HttpPost]
        [Route("GetDoctorTimeSlotById")]
        public async Task<IActionResult> GetDoctorTimeSlot(DoctorTimeSlotRequestModel model)
        {
            ApiResponse<List<DoctorAvailabilityModel>> ApiResponse = new ApiResponse<List<DoctorAvailabilityModel>>();
            List<DoctorAvailabilityModel> response = new List<DoctorAvailabilityModel>();
            response = await _mediator.Send(new GetDoctorTimeSlotQuery(model));
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
