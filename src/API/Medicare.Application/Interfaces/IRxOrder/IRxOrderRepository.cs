using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Orders;

namespace Medicare.Application.Interfaces.IOrders
{
    public interface IRxOrderRepository
    {
        Task<List<RxOrderDetailModel>> GetRxOrderByPatientIdAsync(int patientId);
        Task<RxOrderDetailModel> GetRxOrderByOrderIdAsync(int orderId);
        Task<ResponseModel> CreateRxOrderAsync(CreateRxOrderRequestModel model);
        Task<ResponseModel> UpdateRxOrderAsync(UpdateRxOrderRequestModel model);
        Task<ResponseModel> CancelRxOrderAsync(CancelRxOrderRequestModel model);
    }
}
