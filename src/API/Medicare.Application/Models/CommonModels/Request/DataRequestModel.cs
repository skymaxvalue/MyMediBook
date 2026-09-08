using System.Text.Json.Serialization;

namespace Medicare.Application.Models.CommonModels.Request
{
    public class DataRequestModel
    {
        public int AssociateId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
    public class DataRequestFilterModel
    {
        [JsonIgnore]
        public Guid TenantId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
