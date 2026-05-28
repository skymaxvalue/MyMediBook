namespace Medicare.Application.Models.Doctor
{
    public class DoctorAvailabilityModel
    {
        public int AvailabilityId { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}
