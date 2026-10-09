using MediatR;
using Medicare.Application.Features.Queries.RoomManegement;
using Medicare.Application.Interfaces.IRoomMangement;
using Medicare.Application.Models.RoomManagement;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetHospitalRoomBedsHandler : IRequestHandler<GetHospitalRoomBedsQuery, HospitalRoomBedsModel>
    {
        private readonly IRoomMangementRepository _roomMangementRepository;
        public GetHospitalRoomBedsHandler(IRoomMangementRepository roomMangementRepository)
        {
            _roomMangementRepository = roomMangementRepository;
        }
        public async Task<HospitalRoomBedsModel> Handle(GetHospitalRoomBedsQuery request, CancellationToken ct)
        {
            return await _roomMangementRepository.GetHospitalRoomBedsAsync(request.model);
        }
    }
}
