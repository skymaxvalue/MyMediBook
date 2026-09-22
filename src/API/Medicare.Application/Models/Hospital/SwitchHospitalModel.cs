using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Models.Hospital
{
    public class SwitchHospitalRequest
    {
        public int HospitalId { get; set; }
    }

    public class SwitchHospitalResponse : IErrorHandling
    {
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
        public int EnrollmentId { get; set; }
        public string PatientRefNo { get; set; } = string.Empty;
        public int HospitalId { get; set; }
        public Guid TenantId { get; set; }
        public List<PatientEnrollmentModel> Enrollments { get; set; } = new();
    }

}
