using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Models.Appointment
{
    public class AppointmentDetailModel          
    {
        public int AppointmentId { get; set; }
        public string VisitPurpose { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public string Prescriptions { get; set; }
        public DoctorProfileModel DoctorProfile { get; set; }
    }
}
