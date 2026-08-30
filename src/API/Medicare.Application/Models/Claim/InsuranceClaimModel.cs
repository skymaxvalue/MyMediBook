namespace Medicare.Application.Models.Claim
{
    //  Claim Request-Response Models
    public class CreateClaimRequest
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
    }

    public class CreateClaimResponse
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = "Pending";
    }

    public class SubmitClaimResponse
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = string.Empty;
        public DateTime SubmittedDate { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }

    //  Forward to Secondary Insurance
    public class ForwardToSecondaryRequest
    {
        public int ClaimId { get; set; }
        public string SecondaryInsuranceId { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class ForwardToSecondaryResponse
    {
        public int ClaimId { get; set; }
        public string ClaimStatus { get; set; } = string.Empty;
        public decimal ForwardedBalance { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }
}
