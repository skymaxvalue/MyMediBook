using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.RoomManagement;

namespace Medicare.Application.Interfaces.IRoomMangement
{
    public interface IRoomMangementRepository
    {
        Task<ResponseModel> AddEditRoomBedsAsync(AddEditRoomBedsRequest model);
        Task<HospitalRoomBedsModel> GetHospitalRoomBedsAsync(GetRoomBedsFilterModel model);
        Task<HospitalRoomAvailableBedsModel> GetHospitalRoomAvailableBedsAsync(GetAvailableRoomsFilterModel model);
    }
}
