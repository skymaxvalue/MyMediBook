namespace Medicare.Application.Models.Patient
{
    public class PatientEnrollmentModel
    {
        public int EnrollmentId { get; set; }
        public int HospitalId { get; set; }
        public Guid TenantId { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string PatientRefNo { get; set; } = string.Empty;
        public DateTime EnrolledDate { get; set; }
        public bool IsActive { get; set; }
    }
}
