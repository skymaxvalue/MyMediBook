using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Dashboard
{
    public class RecentPatientDataModel : IErrorHandling
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UHID { get; set; }
        public string ConsultationStatus { get; set; }
        public string VisitedTime { get; set; }
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }
    }
    public class PatientQueueDataModel : IErrorHandling
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DoctorName { get; set; }
        public string AppointmentTime { get; set; }
        public string ConsultationStatus { get; set; }
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }
    }
}
