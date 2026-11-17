using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.PhysicianConsultation;

namespace Medicare.Application.Models.Consultation
{
    public class ConsultationDetailModel: IErrorHandling
    {
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string? ResponseMessage { get; set; }

        public int? ConsultationId { get; set; }
        public int? AppointmentId { get; set; }
        public string? AppointmentStatus { get; set; }
        public string? ConsultationRefNo { get; set; }
        public string? ConsultationStatus { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public string? CurrentMedicationsText { get; set; }
        public string? ConsultationMode { get; set; }
        public string? VisitType { get; set; }
        public string? VisitPurpose { get; set; }
        public string? ReferralSource { get; set; }
        public string? ReferredBy { get; set; }
        public string? AppointmentNotes { get; set; }
        public string? Urgency { get; set; }
        public DateTime? CreatedDate { get; set; }

        public int? PatientId { get; set; }
        public int? ProfileId { get; set; }
        public string? PatientName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? PhoneNumber { get; set; }

        public int? AssociateId { get; set; }
        public string? PhysicianName { get; set; }
        public string? Specialty { get; set; }
        public DateTime? SlotDate { get; set; }
        public string? SlotStartTime { get; set; }
        public string? SlotEndTime { get; set; }

        public string? ChiefComplaint { get; set; }
        public string? SymptomDuration { get; set; }
        public DateTime? SymptomOnset { get; set; }
        public string? HpiLocation { get; set; }
        public string? HpiQuality { get; set; }
        public string? HpiSeverity { get; set; }
        public string? HpiPattern { get; set; }
        public string? HpiAggravating { get; set; }
        public string? HpiRelieving { get; set; }
        public string? HpiProgression { get; set; }
        public string? OtherSymptoms { get; set; }
        public int? PainLevel { get; set; }

        public string? ExistingConditions { get; set; }
        public string? PreviousDiagnoses { get; set; }
        public string? ChronicIllnesses { get; set; }
        public string? PreviousSurgeries { get; set; }
        public string? SurgicalProcedure { get; set; }
        public DateTime? SurgeryDate { get; set; }
        public string? SurgeryNotes { get; set; }
        public string? AllergyStatus { get; set; }
        public string? DrugAllergies { get; set; }
        public string? FoodAllergies { get; set; }
        public string? OtherAllergies { get; set; }
        public string? AllergyReaction { get; set; }
        public bool NoMedications { get; set; }
        public string? FamilyHistory { get; set; }
        public string? Smoking { get; set; }
        public string? Alcohol { get; set; }
        public string? Exercise { get; set; }
        public string? LifestyleNotes { get; set; }

        public string? BloodPressure { get; set; }
        public decimal? HeartRate { get; set; }
        public decimal? Temperature { get; set; }
        public decimal? RespiratoryRate { get; set; }
        public decimal? SpO2 { get; set; }
        public decimal? HeightCm { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? Bmi { get; set; }
        public string? RedFlags { get; set; }
        public string? FallRisk { get; set; }
        public string? MobilityAssist { get; set; }
        public string? InterpreterRequired { get; set; }
        public string? PregnancyStatus { get; set; }

        public bool? InfoAccuracy { get; set; }
        public bool? TreatmentConsent { get; set; }
        public bool? PrivacyConsent { get; set; }
        public bool? TelemedicineConsent { get; set; }
        public DateTime? ConsentedAt { get; set; }
        // Filled by the repository from the two JSON columns below
        public List<string> AssociatedSymptoms { get; set; } = new();
        public List<ConsultationMedicationModel> Medications { get; set; } = new();
        public string? AssociatedSymptomsJson { get; set; }
        public string? MedicationsJson { get; set; }
    }
}
