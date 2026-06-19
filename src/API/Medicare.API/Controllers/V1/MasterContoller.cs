using MediatR;
using Medicare.Application.Features.Queries.Master;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.MasterModels;
using Medicare.Application.Models.Speciality;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class MasterContoller : Controller
    {
        private readonly IMediator _mediator;
        public MasterContoller(IMediator mediator)
        {
            _mediator = mediator;
        }


        [HttpGet]
        [Route("GetWeekDaysList")]
        public async Task<IActionResult> GetWeekDaysList()
        {
            ApiResponse<List<WeekDaysModel>> ApiResponse = new ApiResponse<List<WeekDaysModel>>();
            List<WeekDaysModel> response = new List<WeekDaysModel>();
            response = await _mediator.Send(new GetWeekDaysListQuery());
            ApiResponse = new ApiResponse<List<WeekDaysModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetSpecialityTypeList")]
        public async Task<IActionResult> GetSpecialityTypeList()
        {
            ApiResponse<List<SpecialityTypeModel>> ApiResponse = new ApiResponse<List<SpecialityTypeModel>>();
            List<SpecialityTypeModel> response = new List<SpecialityTypeModel>();
            response = await _mediator.Send(new GetSpecialityTypeListQuery());
            ApiResponse = new ApiResponse<List<SpecialityTypeModel>>
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
