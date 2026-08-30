using Medicare.Application.Models.Claim;

namespace Medicare.Application.Interfaces.IBilling
{
    public interface IBillingRepository
    {
        Task<BillingSummaryModel> GetBillByClaimIdAsync(int id);
        Task<List<BillingSummaryModel>> GetBillingListByPatientIdAsync(int patientId);
    }
}
