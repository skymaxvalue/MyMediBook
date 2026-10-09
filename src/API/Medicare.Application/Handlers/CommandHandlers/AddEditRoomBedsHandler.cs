using MediatR;
using Medicare.Application.Features.Commands.RoomMangement;
using Medicare.Application.Interfaces.IRoomMangement;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class AddEditRoomBedsHandler : IRequestHandler<AddEditRoomBedsCommand, ResponseModel>
    {
        private readonly IRoomMangementRepository _roomMangementRepository;
        public AddEditRoomBedsHandler(IRoomMangementRepository roomMangementRepository) {
            _roomMangementRepository = roomMangementRepository;
        }
        public async Task<ResponseModel> Handle(AddEditRoomBedsCommand request, CancellationToken ct)
        {
            return await _roomMangementRepository.AddEditRoomBedsAsync(request.model);
        }
    }
}
