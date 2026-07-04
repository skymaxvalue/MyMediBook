using MediatR;
using Medicare.Application.Features.Commands.Associate;
using Medicare.Application.Features.Queries.Associate;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class AssociateController : BaseApiController
    {
        private readonly IMediator _mediator;
        public AssociateController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAssociatebyId/{associateId}")]
        public async Task<IActionResult> GetAssociatebyId([FromRoute] int associateId)
        {
            AssociateDetailModel response = new AssociateDetailModel();
            response = await _mediator.Send(new GetAssociateDetailByIdQuery(associateId));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetAssociateList")]
        public async Task<IActionResult> GetAssociateList()
        {
            List<AssociateListModel> response = new List<AssociateListModel>();
            response = await _mediator.Send(new GetAssociateListQuery());
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("CreateAssociateSchedule")]
        public async Task<IActionResult> CreateAssociateSchedule(AssociateScheduleModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAssociateScheduleCommand(model));
            return HandleResponse(response);
        }
    }
}
