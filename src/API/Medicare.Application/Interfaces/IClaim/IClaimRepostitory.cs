using Medicare.Application.Models.Billing;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Interfaces.IClaim
{
    public interface IClaimRepostitory
    {
        Task<CreateClaimResponse> CreateClaimAsync(CreateClaimRequest model);
        Task<LineItemResponse> AddConsultationChargeAsync(AddConsultationRequest model);
        Task<LineItemResponse> AddLabTestChargeAsync(AddLabTestRequest model);
        Task<LineItemResponse> AddScanChargeAsync(AddScanRequest model);
        Task<LineItemResponse> AddICUChargeAsync(AddICURequest model);
        Task<LineItemResponse> AddBedChargeAsync(AddBedChargeRequest model);
        Task<LineItemResponse> AddSurgeryChargeAsync(AddSurgeryRequest model);
        Task<LineItemResponse> AddPharmacyChargeAsync(AddPharmacyRequest model);
        Task<LineItemResponse> AddNursingChargeAsync(AddNursingRequest model);
        Task<LineItemResponse> AddConsumableChargeAsync(AddConsumableRequest model);
        Task<SubmitClaimResponse> SubmitClaimAsync(int claimId);
        Task<PostInsurancePaymentResponse> PostInsurancePaymentAsync(PostInsurancePaymentRequest model);
        Task<PostAdjustmentResponse> PostAdjustmentAsync(PostAdjustmentRequest model);
        Task<CalculateResponsibilityResponse> CalculatePatientResponsibilityAsync(CalculateResponsibilityRequest model);
        Task<CollectCopayResponse> CollectCopayAsync(CollectCopayRequest model);
        Task<GenerateStatementResponse> GenerateStatementAsync(int claimId);
        Task<PostPatientPaymentResponse> PostPatientPaymentAsync(PostPatientPaymentRequest model);
        Task<ForwardToSecondaryResponse> ForwardToSecondaryAsync(ForwardToSecondaryRequest model);
        Task<ClaimAuditResponse> GetClaimAuditById(int claimId);
    }
}
