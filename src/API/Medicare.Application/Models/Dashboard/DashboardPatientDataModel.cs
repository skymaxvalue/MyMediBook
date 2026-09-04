namespace Medicare.Application.Models.Dashboard
{
    public class RecentPatientDataModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UHID { get; set; }
        public string ConsultationStatus { get; set; }
        public string VisitedTime { get; set; }
    }
    public class PatientQueueDataModel
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DoctorName { get; set; }
        public string AppointmentTime { get; set; }
        public string ConsultationStatus { get; set; }
    }
}
