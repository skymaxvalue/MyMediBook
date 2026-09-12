using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Patient
{
    public class PatientListResponseModel : IErrorHandling
    {
        public int PatientId { get; set; }
        public string? PatientFirstName { get; set; }
        public string? PatientLastName { get; set; }
        public string? PatientFullName { get; set; }
        public DateTime? PatientDateOfBirth { get; set; }
        public string? PatientGender { get; set; }
        public string? PatientEmail { get; set; }
        public string? PatientPhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? ZipCode { get; set; }
        public string? CityName { get; set; }
        public string? StateName { get; set; }
        public string? CountryName { get; set; }
        public bool PatientIsActive { get; set; }
        public DateTime? PatientCreatedDate { get; set; }
        public DateTime? PatientUpdatedDate { get; set; }

        // Profile
        public int ProfileId { get; set; }
        public string? ProfileFirstName { get; set; }
        public string? ProfileLastName { get; set; }
        public string? ProfileFullName { get; set; }
        public DateTime? ProfileDateOfBirth { get; set; }
        public int? Age { get; set; }
        public int? AgeTypeId { get; set; }
        public string? AgeTypeName { get; set; }
        public string? ProfileGender { get; set; }
        public string? ProfileEmail { get; set; }
        public string? ProfilePhoneNumber { get; set; }
        public int? RelationTypeId { get; set; }
        public string? RelationTypeName { get; set; }
        public bool ProfileIsActive { get; set; }
        public DateTime? ProfileCreatedDate { get; set; }
        public DateTime? ProfileUpdatedDate { get; set; }
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }
    }
}
