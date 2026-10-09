using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.RoomManagement;

namespace Medicare.Application.Features.Commands.RoomMangement
{
    public record AddEditRoomBedsCommand(AddEditRoomBedsRequest model)  : IRequest<ResponseModel>;
}
