using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Models.Patient
{
    public class SearchPatientRequestModel
    {
        public string? Name { get; set; }
        public DateTime? DOB { get; set; }
        public int? AssociateId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
    public class SearchPatientResponseModel
    {
        public int ProfileId { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public int DoctorId { get; set; }
        public int DoctorName { get; set; }
        public string Speciality { get; set;  }
        public string AppointmentDate { get; set; }
        public string AppointmentDay { get; set; }
        public string AppointmentStatus { get; set; }
        public string SlotStartTime { get; set; }
        public string SlotEndTime { get; set; }
        public int IsCheckedIn { get; set; }
        public DateTime? CheckedInAt { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? DateOfBirth { get; set; }
        public int Age { get; set; }
        public int AgeTypeId { get; set; }
        public string? AgeTypeName { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int RelationTypeId { get; set; }
        public string? RelationTypeName { get; set; }   // "Self" | "Spouse" | "Child" etc.
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
    }
}
