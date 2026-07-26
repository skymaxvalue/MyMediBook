namespace Medicare.Application.Models.BackgroundJob.Appointment
{
    public class StaleAppointmentRequestModel
    {
        public Guid TenantId { get; set; }
        public int ThresholdMins { get; set; }
    }
    public class UpdateAppointmentRequestModel
    {
        public int AppointmentId { get; set; }
        public int CleanupAfterHours { get; set; }
        public string ReminderType { get; set; }
        public string NotificationChannel { get; set; }
    }
    public class ReleaseAppointmentRequestModel
    {
        public int AppointmentId { get; set; }
        public int SlotId { get; set; }
    }
}
