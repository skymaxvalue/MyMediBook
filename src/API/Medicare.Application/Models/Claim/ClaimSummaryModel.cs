using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Claim
{
    public class ClaimSummaryModel
    {
        public int ClaimId { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public int ProfileId { get; set; }
        public int HospitalId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public DateTime DateOfService { get; set; }
        public DateTime ClaimDate { get; set; }
        public decimal TotalChargeAmount { get; set; }
        public decimal TotalAllowedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal TotalAdjustmentAmount { get; set; }
        public decimal TotalPatientResponsibility { get; set; }
        public decimal RemainingBalance { get; set; } 
        public string ClaimStatus { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
    }
    public class ClaimLineItemModel
    {
        public int LineItemId { get; set; }
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string ServiceCategory { get; set; } 
        public string CPTCode { get; set; } 
        public string ServiceDescription { get; set; } 
        public int Units { get; set; }
        public decimal ChargeAmount { get; set; }
        public decimal AllowedAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string? LineStatus { get; set; }
        public DateTime CreatedDate { get; set; }
    }
    public class ClaimPaymentModel
    {
        public int PaymentId { get; set; }
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string PaymentReference { get; set; } = string.Empty;
        public decimal PaidAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public int? PayerSequence { get; set; }
        public DateTime CreatedDate { get; set; }
    }
    public class ClaimAdjustmentModel
    {
        public int AdjustmentId { get; set; }
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public int LineItemId { get; set; }
        public string AdjustmentCode { get; set; } = string.Empty;
        public string AdjustmentDescription { get; set; } = string.Empty;
        public decimal AdjustmentAmount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
    public class ClaimPatientResponsibilityModel
    {
        public int ResponsibilityId { get; set; }
        public int ClaimId { get; set; }
        public int LineItemId { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
    public class BillingSummaryModel : IErrorHandling
    {
        public IEnumerable<ClaimSummaryModel> Claims { get; set; } = [];
        public IEnumerable<ClaimLineItemModel> LineItems { get; set; } = [];
        public IEnumerable<ClaimPaymentModel> InsurancePayments { get; set; } = [];
        public IEnumerable<ClaimAdjustmentModel> Adjustments { get; set; } = [];
        public IEnumerable<ClaimPatientResponsibilityModel> PatientResponsibility { get; set; } = [];
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; }
    }
}
