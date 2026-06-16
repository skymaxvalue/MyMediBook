using Medicare.Application.Models.Doctor;
using Medicare.Application.Models.Speciality;
namespace Medicare.Application.Interfaces.IDoctor
{
    public interface IDoctorRepository
    {
        Task<List<DoctorItemModel>> GetDoctorListAsync();
        Task<List<DoctorAvailabilityModel>> GetDoctorAvailabilitiesAsync(int associateId);
        Task<List<SpecialityDataModel>> GetDoctorSpecialityListAsync(string? doctorName, string? departmentName);
    }
}