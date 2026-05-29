using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Interfaces.IAppointment
{
    public interface IAppointmentRepository
    {
        Task<List<PatientAppointmentModel>> GetMyAppointmentsAsync(int patientId);
        Task<List<SpecialityModel>> GetSpecialitiesAsync(string? doctorName, string? departmentName);
       Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(int doctorId, DateTime requestedDate);
    }
}
