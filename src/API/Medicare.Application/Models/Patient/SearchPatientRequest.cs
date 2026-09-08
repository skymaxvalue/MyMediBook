namespace Medicare.Application.Models.Patient
{
    public class SearchPatientRequest
    {
        public string? Name { get; set; }
        public DateTime? DOB { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
