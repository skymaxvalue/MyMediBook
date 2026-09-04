namespace Medicare.Application.Models.Claim
{
    public class ClaimAuditResponse
    {
        public ClaimAuditSummary Claim { get; set; } = new();
        public IEnumerable<AuditLineItem> LineItems { get; set; } = [];
        public IEnumerable<AuditPayment> InsurancePayments { get; set; } = [];
        public IEnumerable<AuditAdjustment> Adjustments { get; set; } = [];
        public IEnumerable<AuditResponsibility> PatientResponsibility { get; set; } = [];
    }

    public class ClaimAuditSummary
    {
        public int ClaimId { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public string ClaimStatus { get; set; } = string.Empty;
        public decimal TotalChargeAmount { get; set; }
        public decimal TotalAllowedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal TotalAdjustmentAmount { get; set; }
        public decimal TotalPatientResponsibility { get; set; }
        public decimal RemainingBalance { get; set; }
        public DateTime ClaimDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
    }

    public class AuditLineItem
    {
        public int LineItemId { get; set; }
        public string ServiceCategory { get; set; } = string.Empty;
        public string CPTCode { get; set; } = string.Empty;
        public string ServiceDescription { get; set; } = string.Empty;
        public int Units { get; set; }
        public decimal ChargeAmount { get; set; }
        public decimal AllowedAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class AuditPayment
    {
        public int PaymentId { get; set; }
        public string PaymentReference { get; set; } = string.Empty;
        public decimal PaidAmount { get; set; }
        public string PayerSequence { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
    }

    public class AuditAdjustment
    {
        public int AdjustmentId { get; set; }
        public string AdjustmentCode { get; set; } = string.Empty;
        public string AdjustmentDescription { get; set; } = string.Empty;
        public decimal AdjustmentAmount { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class AuditResponsibility
    {
        public int ResponsibilityId { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
