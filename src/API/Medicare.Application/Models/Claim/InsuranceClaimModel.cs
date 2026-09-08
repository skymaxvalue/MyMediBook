using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Claim
{
    //  Claim Request-Response Models
    public class CreateClaimRequest
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
    }

    public class CreateClaimResponse : IErrorHandling
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = "Pending";
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }
    }

    public class SubmitClaimResponse : IErrorHandling
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = string.Empty;
        public DateTime SubmittedDate { get; set; }
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } 
    }

    //  Forward to Secondary Insurance
    public class ForwardToSecondaryRequest
    {
        public int ClaimId { get; set; }
        public string SecondaryInsuranceId { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class ForwardToSecondaryResponse : IErrorHandling
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = string.Empty;
        public decimal ForwardedBalance { get; set; }
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } 
    }
}
