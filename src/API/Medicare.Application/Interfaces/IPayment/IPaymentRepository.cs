using Medicare.Application.Models.Payments;

namespace Medicare.Application.Interfaces.IPayments
{
    public interface IPaymentRepository
    {
        Task<List<PaymentRecordModel>> GetPaymentRecordsByPatientIdAsync(GetPaymentRecordsRequestModel model);
    }
}