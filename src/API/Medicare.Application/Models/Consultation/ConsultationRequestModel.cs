using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Consultation
{
    public class GetConsultationsRequestModel
    {
        public int? ConsultationStatusId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        [JsonIgnore]
        public int HospitalId { get; set; }
        [JsonIgnore]
        public int AssociateId { get; set; }
    }
}
