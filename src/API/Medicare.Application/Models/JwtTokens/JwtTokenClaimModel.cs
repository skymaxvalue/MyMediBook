using Medicare.Application.Models.Patient;

namespace Medicare.Application.Models.JwtTokens
{
    public class JwtTokenClaimModel
    {
        public Guid UserId { get; set; }   
        public int RefId { get; set; }   
        public string UserType { get; set; }   
        public string Email { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public Guid? TenantId { get; set; }
        public Guid ActiveTenantId { get; set; }
        public int ActiveHospitalId { get; set; }
    }
    public class JwtRefreshTokenModel
    {
        public Guid UserId { get; set; }
        public string UserType { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
    public class JwtPatientClaimModel
    {
        public Guid UserId { get; set; }
         public int RefId { get; set; }
        public string UserType { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public Guid? TenantId { get; set; }
        public int PatientId { get; set; }
        public string Email { get; set; }
        public int ActiveHospitalId { get; set; }
        public Guid ActiveTenantId { get; set; }
        public int ActiveEnrollmentId { get; set; }
        public string PatientRefNo { get; set; }
        public IEnumerable<PatientEnrollmentModel> AllEnrollments { get; set; }
    }
}
