using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Claim
{
    public class PostPatientPaymentRequest
    {
        public int ClaimId { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? ReferenceNo { get; set; }
    }

    public class PostPatientPaymentResponse : IErrorHandling
    {
        public int TransactionId { get; set; }
        public decimal RemainingBalance { get; set; }

        /// <summary>Pending | PartiallyPaid | Closed</summary>
        public string ClaimStatus { get; set; } = string.Empty;
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } 
    }
}
