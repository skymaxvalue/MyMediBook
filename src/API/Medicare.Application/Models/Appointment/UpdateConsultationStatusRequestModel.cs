using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Appointment
{
    public class UpdateConsultationStatusRequestModel
    {
        [JsonIgnore]
        public int AssociateId { get; set; }
        public int AppointmentId { get; set; }
        public int ConsultationStatusId { get; set; }
    }
}
