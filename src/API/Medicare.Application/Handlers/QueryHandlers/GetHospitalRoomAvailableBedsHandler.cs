using MediatR;
using Medicare.Application.Features.Queries.RoomManegement;
using Medicare.Application.Interfaces.IRoomMangement;
using Medicare.Application.Models.RoomManagement;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetHospitalRoomAvailableBedsHandler : IRequestHandler<GetHospitalRoomAvailableBedsQuery,HospitalRoomAvailableBedsModel>
    {
        private readonly IRoomMangementRepository _roomMangementRepository;
        public GetHospitalRoomAvailableBedsHandler(IRoomMangementRepository roomMangementRepository)
        {
            _roomMangementRepository = roomMangementRepository;
        }
        public async Task<HospitalRoomAvailableBedsModel> Handle(GetHospitalRoomAvailableBedsQuery request, CancellationToken ct)
        {
            return await _roomMangementRepository.GetHospitalRoomAvailableBedsAsync(request.model);
        }
    }
}
