using MediatR;
using Medicare.Application.Features.Commands.RoomMangement;
using Medicare.Application.Features.Queries.RoomManegement;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.RoomManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomManagementController : BaseApiController
    {
        private readonly IMediator _mediator;
        public RoomManagementController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("AddEditRoomBeds")]
        [Authorize(Policy = "HospitalAdmin")]
        public async Task<IActionResult> AddEditRoomBeds([FromBody] AddEditRoomBedsRequest model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            model.CreatedBy = int.Parse(User.FindFirst("RefId")!.Value);
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new AddEditRoomBedsCommand(model));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetHospitalRoomBeds")]
        public async Task<IActionResult> GetHospitalRoomBeds(GetRoomBedsFilterModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            HospitalRoomBedsModel response = new HospitalRoomBedsModel();
            response = await _mediator.Send(new GetHospitalRoomBedsQuery(model));
            return Ok(response);
        }

        [HttpGet]
        [Route("GetHospitalRoomAvailableBeds")]
        public async Task<IActionResult> GetHospitalRoomAvailableBeds(GetAvailableRoomsFilterModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            HospitalRoomAvailableBedsModel response = new HospitalRoomAvailableBedsModel();
            response = await _mediator.Send(new GetHospitalRoomAvailableBedsQuery(model));
            return Ok(response);
        }
    }
}
