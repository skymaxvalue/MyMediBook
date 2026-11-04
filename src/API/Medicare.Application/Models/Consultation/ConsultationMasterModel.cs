using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Consultation
{

    namespace Medicare.Application.Models.Consultation
    {
        public class ConsultationMasterModel
        {
            public int ConsultationId { get; set; }
            public string? ConsultationRefNo { get; set; }
            public int PatientId { get; set; }
            public int ProfileId { get; set; }
            public int? AppointmentId { get; set; }
            public int? AssociateId { get; set; }
            public int HospitalId { get; set; }
            public int? SpecialityId { get; set; }
            public int? VisitPurposeId { get; set; }
            public byte? VisitTypeId { get; set; }
            public string? ConsultationMode { get; set; }
            public DateTime? PreferredDate { get; set; }
            public TimeSpan? PreferredTime { get; set; }
            public string? ProviderPreference { get; set; }
            public string? ChiefComplaint { get; set; }
            public string? SymptomDuration { get; set; }
            public byte? PainLevel { get; set; }
            public string? UrgencyLevel { get; set; }
            public int ConsultationStatusId { get; set; }
            public string? CreatedBy { get; set; }
        }
    }
    public class ConsultationResponseModel : IErrorHandling
    {
        public long ConsultationId { get; set; }
        public string? ConsultationRefNo { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public long? AppointmentId { get; set; }
        public int? AssociateId { get; set; }
        public int HospitalId { get; set; }
        public int? SpecialityId { get; set; }
        public int? VisitPurposeId { get; set; }
        public byte? VisitTypeId { get; set; }
        public string? ConsultationMode { get; set; }
        public DateTime? PreferredDate { get; set; }
        public TimeSpan? PreferredTime { get; set; }
        public string? ProviderPreference { get; set; }
        public string? ChiefComplaint { get; set; }
        public string? SymptomDuration { get; set; }
        public byte? PainLevel { get; set; }
        public string? UrgencyLevel { get; set; }
        public int ConsultationStatusId { get; set; }
        public string? ConsultationStatus { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ResponseMessage { get; set; }
        public int Status { get; set; }
        public int IsSuccess { get; set; }
    }
}
