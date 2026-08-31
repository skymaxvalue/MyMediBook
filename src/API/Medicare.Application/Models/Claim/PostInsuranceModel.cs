using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Claim
{
    // Post Insurance Payment (ERA/EOB)
    public class PostInsurancePaymentRequest
    {
        public int ClaimId { get; set; }
        public decimal PaidAmount { get; set; }
        public string PaymentReference { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }

        /// <summary>Primary | Secondary | Tertiary</summary>
        public string PayerSequence { get; set; } = "Primary";
    }

    public class PostInsurancePaymentResponse
    {
        public int PaymentId { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal RemainingBalance { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }

    // Post Insurance Adjustment (CO/PR/OA)
    public class PostAdjustmentRequest
    {
        public int ClaimId { get; set; }
        public int? LineItemId { get; set; }

        /// <summary>CO = Contractual Obligation | PR = Patient Responsibility | OA = Other Adjustment</summary>
        public string AdjustmentCode { get; set; } = string.Empty;
        public string AdjustmentDescription { get; set; } = string.Empty;
        public decimal AdjustmentAmount { get; set; }
    }

    public class PostAdjustmentResponse
    {
        public int AdjustmentId { get; set; }
        public decimal TotalAdjustmentAmount { get; set; }
        public decimal RemainingBalance { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }

    //  Calculate Patient Responsibility
    public class CalculateResponsibilityRequest
    {
        public int ClaimId { get; set; }
        public decimal Deductible { get; set; }
        public decimal Coinsurance { get; set; }   // percentage e.g. 20.00 = 20%
        public decimal Copay { get; set; }
    }

    public class CalculateResponsibilityResponse
    {
        public decimal TotalPatientResponsibility { get; set; }
        public decimal RemainingBalance { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }

    //  Collect Copay
    public class CollectCopayRequest
    {
        public int AppointmentId { get; set; }
        public decimal CopayAmount { get; set; }

        /// <summary>Cash | Card | Insurance</summary>
        public string PaymentMethod { get; set; } = string.Empty;
        public string? ReferenceNo { get; set; }
    }

    public class CollectCopayResponse : IErrorHandling
    {
        public int TransactionId { get; set; }
        public decimal AmountCollected { get; set; }
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } 
    }
}
