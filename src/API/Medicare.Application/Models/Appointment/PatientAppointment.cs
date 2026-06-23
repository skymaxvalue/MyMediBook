namespace Medicare.Application.Models.Appointment
{
    public class PatientAppointmentModel
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int AssociateId { get; set; }
        public string DoctorName { get; set; }
        public string Speciality { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public string AppointmentStatus { get; set; }         // Scheduled / Cancelled / Completed
        public string VisitPurpose { get; set; }   
        public string VisitType { get; set; }
        public string RelationType { get; set; }
    }

    public class AvailableAppointmentModel
    {
        public int SlotId { get; set; }
        public int AssociateId { get; set; }
        public string DoctorName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public bool IsBooked { get; set; }
    }
    public class AvailableAppointmentRequestModel
    {
        public int AssociateId { get; set; }
        public DateTime RequestedDate { get; set; }
    }
}
