using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Features.Queries.Department;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Department;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class DepartmentController : Controller
    {
        private readonly IMediator _mediator;
        public DepartmentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetDepartmentList")]
        public async Task<IActionResult> GetDepartmentList()
        {
            ApiResponse<List<DepartmentDataModel>> ApiResponse = new ApiResponse<List<DepartmentDataModel>>();
            List<DepartmentDataModel> response = new List<DepartmentDataModel>();
            response = await _mediator.Send(new GetDepartmentListQuery());
            ApiResponse = new ApiResponse<List<DepartmentDataModel>>
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
