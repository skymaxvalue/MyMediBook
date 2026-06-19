using MediatR;
using Medicare.Application.Features.Commands.Associate;
using Medicare.Application.Features.Queries.Associate;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AssociateController : Controller
    {
        private readonly IMediator _mediator;
        public AssociateController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAssociatebyId")]
        public async Task<IActionResult> GetAssociatebyId(int associateId)
        {
            ApiResponse<AssociateDetailModel> ApiResponse = new ApiResponse<AssociateDetailModel>();
            AssociateDetailModel response = new AssociateDetailModel();
            response = await _mediator.Send(new GetAssociateDetailByIdQuery(associateId));
            ApiResponse = new ApiResponse<AssociateDetailModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("RegisterAssociateMaster")]
        public async Task<IActionResult> RegisterAssociateMaster(RegisterAssociateModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAssociateCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
        [HttpPost]
        [Route("CreateAssociateSchedule")]
        public async Task<IActionResult> CreateAssociateSchedule(AssociateScheduleModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAssociateScheduleCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>
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
