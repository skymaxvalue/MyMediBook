using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Models.Authentication
{
    public class AuthModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AuthDetailModel
    {
        public Guid UserId { get; set; }
        public int RefId { get; set; }
        public string UserType { get; set; }
        public string Email { get; set; } 
        public string PasswordHash { get; set; } 
        public bool IsLockedOut { get; set; }
        public int? ActiveHospitalId { get; set; }
    }
    
    public class AuthResultModel : IErrorHandling
    {
        public Guid UserId { get; set; }
        public int RefId { get; set; }     
        public string UserType { get; set; } = string.Empty;
        public int PatientId { get; set; }
        public int ActiveHospitalId { get; set; }
        public Guid ActiveTenantId { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public bool NeedsHospitalSelection { get; set; }
        public List<PatientEnrollmentModel> Enrollments { get; set; } = new();
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public int ActiveEnrollmentId { get; set; }
        public string PatientRefNo { get; set; }
        public Guid? TenantId { get; set; }
        public string? EmployeeId { get; set; }
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
    }
}
