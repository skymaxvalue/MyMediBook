namespace Medicare.Application.Models.Appointment
{
    public class PatientAppointmentModel
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string Speciality { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public string Status { get; set; }         // Scheduled / Cancelled / Completed
        public string Notes { get; set; }
    }
    public class SpecialityModel
    {
        public int SpecialityId { get; set; }
        public string SpecialityName { get; set; }
        public string DepartmentName { get; set; }
        public string DoctorName { get; set; }
    }

    public class AvailableAppointmentModel
    {
        public int SlotId { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public bool IsBooked { get; set; }
    }
    public class AvailableAppointmentRequestModel
    {
        public int DoctorId { get; set; }
        public DateTime RequestedDate { get; set; }
    }
}
