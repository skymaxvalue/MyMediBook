namespace Medicare.Application.Models.BackgroundJob.ReminderLog
{
    public class ReminderLogModel
    {
        public int AppointmentId { get; set; }
        public Guid TenantId { get; set; }
        public int PatientId { get; set; }
        public int OtpTypeId { get; set; }
        public string ReminderType { get; set; }
        public string NotificationChannel { get; set; }
        public string SentTo { get; set; }
        public bool IsSuccess { get; set; }
    }
}
