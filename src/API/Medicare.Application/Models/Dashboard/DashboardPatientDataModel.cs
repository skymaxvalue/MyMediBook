namespace Medicare.Application.Models.Dashboard
{
    public class DashboardDataRequestModel
    {
        public int AssociateId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
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
