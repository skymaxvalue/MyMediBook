using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Organization
{
    public class OrganizationDataModel : IErrorHandling
    {
        public int HospitalId { get; set; }
        public Guid TenantId { get; set; }
        public string HospitalName { get; set; }
        public string RegistrationNumber { get; set; }
        public string LicenseNumber { get; set; }
        public string HospitalType { get; set; }
        public string Email { get; set; }
        public string PhoneCountryCode { get; set; }
        public string PhoneNumber { get; set; }
        public string Website { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int? CityId { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public string ZipCode { get; set; }
        public string LogoPath { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }

    }
}
