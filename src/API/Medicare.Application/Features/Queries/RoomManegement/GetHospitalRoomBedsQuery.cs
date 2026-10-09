using MediatR;
using Medicare.Application.Models.RoomManagement;

namespace Medicare.Application.Features.Queries.RoomManegement
{
    public record GetHospitalRoomBedsQuery(GetRoomBedsFilterModel model)   : IRequest<HospitalRoomBedsModel>;
}
