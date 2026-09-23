using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Models.Hospital
{
    public class EnrollPatientRequest
    {
        public int HospitalId { get; set; }
    }

    public class EnrollPatientResponse : IErrorHandling
    {
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
        public int EnrollmentId { get; set; }
        public string PatientRefNo { get; set; } = string.Empty;
        public int HospitalId { get; set; }
        public Guid TenantId { get; set; }

        // Populated separately — USP_EnrollPatientInHospital SP must return these
        // or fetch them with a second call to USP_GetPatientEnrollments
        public List<PatientEnrollmentModel> Enrollments { get; set; } = new();
    }
}
