namespace Medicare.Application.Models.Appointment
{
    public class UpdateCheckedInStatusRequestModel
    {
        public int AppointmentId { get; set; }
        public bool IsCheckedIn { get; set; }
    }
}
