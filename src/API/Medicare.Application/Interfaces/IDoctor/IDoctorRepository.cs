using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Interfaces.IDoctor
{
    public interface IDoctorRepository
    {
        Task<List<DoctorAvailabilityModel>> GetDoctorAvailabilitiesAsync(int doctorId);
    }
}
