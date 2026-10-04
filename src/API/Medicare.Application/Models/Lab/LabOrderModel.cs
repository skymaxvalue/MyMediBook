using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Lab
{
    public class LabOrderRequestModel
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public string Priority { get; set; }
        public string? Notes { get; set; }
        public string TestList { get; set; }
        [JsonIgnore]
        public int HospitalId { get; set; }
        [JsonIgnore]
        public int CreatedBy { get; set; }
    }
}
