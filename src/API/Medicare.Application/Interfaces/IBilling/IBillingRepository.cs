using Medicare.Application.Models.Billing;

namespace Medicare.Application.Interfaces.IBilling
{
    public interface IBillingRepository
    {
        Task<BillingSummaryModel> GetBillByClaimIdAsync(int id);
        Task<List<BillingSummaryModel>> GetBillingListByPatientIdAsync(int patientId);
    }
}
