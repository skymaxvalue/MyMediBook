using MediatR;
using Medicare.Application.Features.Queries.Role;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Role;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class RoleController : Controller
    {
        private readonly IMediator _mediator;
        public RoleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetRoleList")]
        public async Task<IActionResult> GetRoleList()
        {
            ApiResponse<List<RoleDataModel>> ApiResponse = new ApiResponse<List<RoleDataModel>>();
            List<RoleDataModel> response = new List<RoleDataModel>();
            response = await _mediator.Send(new GetRoleListQuery());
            ApiResponse = new ApiResponse<List<RoleDataModel>>
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
