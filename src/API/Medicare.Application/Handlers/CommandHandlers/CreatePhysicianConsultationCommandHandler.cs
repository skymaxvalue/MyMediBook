using MediatR;
using System.Text.RegularExpressions;
using Medicare.Application.Models.PhysicianConsultation;
using Medicare.Application.Features.Commands.Consultation;
using Medicare.Application.Interfaces.IPhysicianConsultation;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreatePhysicianConsultationCommandHandler : IRequestHandler<CreatePhysicianConsultationCommand, CreateConsultationResponseModel>
    {
        private static readonly string[] Modes = { "In Person", "Video Consultation", "Telephonic" };
        private static readonly string[] Urgencies = { "Routine", "Soon", "Urgent", "Emergency" };
        private static readonly string[] Allergy = { "No Known Allergies", "Allergies Present" };
        private static readonly string[] YesNo = { "Yes", "No" };

        private readonly IConsultationRepository _repository;

        public CreatePhysicianConsultationCommandHandler(IConsultationRepository repository)
        {
            _repository = repository;
        }

        public async Task<CreateConsultationResponseModel> Handle(CreatePhysicianConsultationCommand request, CancellationToken cancellationToken)
        {
            var error = Validate(request.model);
            if (error != null)
                return new CreateConsultationResponseModel { IsSuccess = 0, Status = 0, ResponseMessage = error };

            return await _repository.CreateConsultationAsync(request.model);
        }

        private static string? Validate(CreatePhysicianConsultationRequestModel m)
        {
            if (m.PatientId <= 0 || m.ProfileId <= 0) return "Patient Is Required";

            var a = m.Appointment;
            if (a.AssociateId <= 0) 
                return "Physician Is Required";
            if (a.SlotId <= 0) 
                return "Appointment Time Is Required";
            if (!Modes.Contains(a.ConsultationMode)) 
                return "Invalid Consultation Mode";
            if (a.VisitTypeId <= 0) 
                return "Visit Type Is Required";
            if (a.VisitPurposeId <= 0) 
                return "Reason For Visit Is Required";

            var s = m.Symptoms;
            if (string.IsNullOrWhiteSpace(s.ChiefComplaint) || s.ChiefComplaint.Length > 500)
                return "Chief Complaint Is Required (Max 500 Characters)";
            if (string.IsNullOrWhiteSpace(s.SymptomDuration)) 
                return "Symptom Duration Is Required";
            if (s.PainLevel is < 0 or > 10) 
                return "Pain Level Must Be Between 0 And 10";
            if (!Urgencies.Contains(s.Urgency)) 
                return "Invalid Urgency";

            var h = m.History;
            if (!Allergy.Contains(h.AllergyStatus)) 
                return "Allergy Status Is Required";
            if (h.AllergyStatus == "Allergies Present" &&
                string.IsNullOrWhiteSpace(h.DrugAllergies) && 
                string.IsNullOrWhiteSpace(h.FoodAllergies) &&
                string.IsNullOrWhiteSpace(h.OtherAllergies))
                return "Please Enter At Least One Allergy";
            if (h.NoMedications && h.Medications.Count > 0)
                return "Medications Must Be Empty When No Current Medications Is Selected";
            if (h.Medications.Any(x => string.IsNullOrWhiteSpace(x.Name) || string.IsNullOrWhiteSpace(x.TakingStatus)))
                return "Each Medication Needs A Name And Taking Status";

            var v = m.Vitals;
            if (!string.IsNullOrWhiteSpace(v.BloodPressure) && !Regex.IsMatch(v.BloodPressure, @"^\d{2,3}/\d{2,3}$"))
                return "Blood Pressure Must Look Like 120/80";
            if (v.HeartRate is < 20 or > 250) 
                return "Heart Rate Is Out Of Range";
            if (v.Temperature is < 30 or > 45) 
                return "Temperature Is Out Of Range";
            if (v.RespiratoryRate is < 4 or > 80) 
                return "Respiratory Rate Is Out Of Range";
            if (v.SpO2 is < 50 or > 100) 
                return "SpO2 Is Out Of Range";
            if (v.HeightCm is < 30 or > 250) 
                return "Height Is Out Of Range";
            if (v.WeightKg is < 1 or > 500) 
                return "Weight Is Out Of Range";

            var sc = m.Screening;
            foreach (var f in new[] { sc.RedFlags, sc.FallRisk, sc.MobilityAssist, sc.InterpreterRequired })
                if (!string.IsNullOrEmpty(f) && !YesNo.Contains(f)) return "Invalid Screening Value";

            var c = m.Consent;
            if (!c.InfoAccuracy || !c.TreatmentConsent || !c.PrivacyConsent)
                return "All Required Consents Must Be Accepted";
            if (a.ConsultationMode != "In Person" && c.TelemedicineConsent != true)
                return "Telemedicine Consent Is Required For This Consultation Mode";

            return null;
        }
    }
}