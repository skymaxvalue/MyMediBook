namespace Medicare.Application.Models.Associate
{
    public class AssociateDetailModel
    {
        public int AssociateId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? IdentityDocument { get; set; }
        //public string? IdentityFile { get; set; }
        public string? EmployeeId { get; set; }
        public string? PhoneCountryCode { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EmailId { get; set; }
        public string? ResidentialAddress { get; set; }
        public string? PermanentAddress { get; set; }
        public int? CityId { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public string? ZipCode { get; set; }
        public string? LanguagesSpoken { get; set; }
        public string? EmergencyName { get; set; }
        public string? EmergencyRelationship { get; set; }
        public string? EmergencyPhone { get; set; }
        public string? EmergencyCode { get; set; }

        public DateTime? JoiningDate { get; set; }
        public string? EmployeeType { get; set; }
        public string AssociateType { get; set; }
        public bool IsActive { get; set; }
        
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? SpecialityId { get; set; }
        public string? SpecialityName { get; set; }

        public int DesignationId { get; set; }
        public string? DesignationName { get; set; }

        public IEnumerable<AssociateQualificationDetailModel> Qualifications { get; set; }
        public IEnumerable<AssociateExperienceDetailModel> Experiences { get; set; }
        public AssociateScheduleDetailModel? Schedule { get; set; }
        public IEnumerable<AssociateDepartmentDetailModel> Departments { get; set; }
        public IEnumerable<AssociateRoleDetailModel> Roles { get; set; }
    }

    public class AssociateQualificationDetailModel
    {
        public int QualificationId { get; set; }
        public string? HighestDegree { get; set; }
        public string? Specialization { get; set; }
        public string? InstitutionName { get; set; }
        public int? YearOfPassing { get; set; }
        public string? RegistrationNumber { get; set; }
        public DateTime? LicenseExpiry { get; set; }
        public string? AdditionalCertifications { get; set; }
        //public string? QualificationDocuments { get; set; }
    }

    public class AssociateExperienceDetailModel
    {
        public int ExperienceId { get; set; }
        public int? ExperienceYears { get; set; }
        public string OrganizationName { get; set; }
        public string? DesignationRole { get; set; }
        public string? DepartmentWorked { get; set; }
        public string? KeySkills { get; set; }
    }

    public class AssociateScheduleDetailModel
    {
        public int ScheduleId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public TimeSpan FromTime { get; set; }
        public TimeSpan ToTime { get; set; }
        public TimeSpan? BreakTimeFrom { get; set; }
        public TimeSpan? BreakTimeTo { get; set; }
        public string WorkingDays { get; set; }
        public int? ConsultationTime { get; set; }
        public decimal? AverageCharge { get; set; }
        public string? OtpMethod { get; set; }
    }

    public class AssociateDepartmentDetailModel
    {
        public int AssocDeptId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }

    public class AssociateRoleDetailModel
    {
        public int AssocRoleId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
