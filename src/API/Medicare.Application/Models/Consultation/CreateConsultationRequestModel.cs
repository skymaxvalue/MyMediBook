using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.PhysicianConsultation
{
    // ---------- Request ----------
    public class CreatePhysicianConsultationRequestModel
    {
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public ConsultationAppointmentModel Appointment { get; set; } = new();
        public ConsultationSymptomsModel Symptoms { get; set; } = new();
        public ConsultationHistoryModel History { get; set; } = new();
        public ConsultationVitalsModel Vitals { get; set; } = new();
        public ConsultationScreeningModel Screening { get; set; } = new();
        public ConsultationConsentModel Consent { get; set; } = new();

        // Set by the controller from the JWT, never trusted from the client
        public int HospitalId { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class ConsultationAppointmentModel
    {
        public int AssociateId { get; set; }
        public int SlotId { get; set; }
        public string ConsultationMode { get; set; } = string.Empty;   // In Person | Video Consultation | Telephonic
        public int VisitTypeId { get; set; }
        public int VisitPurposeId { get; set; }
        public int? OtpTypeId { get; set; }                            // contact method
        public string? ReferralSource { get; set; }
        public string? ReferredBy { get; set; }
        public string? Notes { get; set; }
    }

    public class ConsultationHpiModel
    {
        public string? Location { get; set; }
        public string? Quality { get; set; }
        public string? Severity { get; set; }
        public string? Pattern { get; set; }
        public string? Aggravating { get; set; }
        public string? Relieving { get; set; }
        public string? Progression { get; set; }
    }

    public class ConsultationSymptomsModel
    {
        public string ChiefComplaint { get; set; } = string.Empty;
        public string SymptomDuration { get; set; } = string.Empty;
        public DateTime? SymptomOnset { get; set; }
        public ConsultationHpiModel Hpi { get; set; } = new();
        public List<string> AssociatedSymptoms { get; set; } = new();
        public string? OtherSymptoms { get; set; }
        public int? PainLevel { get; set; }
        public string Urgency { get; set; } = "Routine";               // Routine | Soon | Urgent | Emergency
    }

    public class ConsultationMedicationModel
    {
        public string Name { get; set; } = string.Empty;
        public string? Dose { get; set; }
        public string? Route { get; set; }
        public string? Frequency { get; set; }
        public string? Indication { get; set; }
        public string TakingStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class ConsultationHistoryModel
    {
        public string? ExistingConditions { get; set; }
        public string? PreviousDiagnoses { get; set; }
        public string? ChronicIllnesses { get; set; }
        public string? PreviousSurgeries { get; set; }
        public string? SurgicalProcedure { get; set; }
        public DateTime? SurgeryDate { get; set; }
        public string? SurgeryNotes { get; set; }
        public string AllergyStatus { get; set; } = string.Empty;      // No Known Allergies | Allergies Present
        public string? DrugAllergies { get; set; }
        public string? FoodAllergies { get; set; }
        public string? OtherAllergies { get; set; }
        public string? AllergyReaction { get; set; }
        public bool NoMedications { get; set; }
        public List<ConsultationMedicationModel> Medications { get; set; } = new();
        public List<string> FamilyHistory { get; set; } = new();
        public string? Smoking { get; set; }
        public string? Alcohol { get; set; }
        public string? Exercise { get; set; }
        public string? LifestyleNotes { get; set; }
    }

    public class ConsultationVitalsModel
    {
        public string? BloodPressure { get; set; }
        public decimal? HeartRate { get; set; }
        public decimal? Temperature { get; set; }
        public decimal? RespiratoryRate { get; set; }
        public decimal? SpO2 { get; set; }
        public decimal? HeightCm { get; set; }
        public decimal? WeightKg { get; set; }
        // BMI is calculated on the server
    }

    public class ConsultationScreeningModel
    {
        public string? RedFlags { get; set; }                          // Yes | No
        public string? FallRisk { get; set; }
        public string? MobilityAssist { get; set; }
        public string? InterpreterRequired { get; set; }
        public string? PregnancyStatus { get; set; }
    }

    public class ConsultationConsentModel
    {
        public bool InfoAccuracy { get; set; }
        public bool TreatmentConsent { get; set; }
        public bool PrivacyConsent { get; set; }
        public bool? TelemedicineConsent { get; set; }
    }

    public class CreateConsultationResponseModel : IErrorHandling
    {
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
        public int? ConsultationId { get; set; }          
        public string? ConsultationRefNo { get; set; }    
        public int? AppointmentId { get; set; }
    }
}