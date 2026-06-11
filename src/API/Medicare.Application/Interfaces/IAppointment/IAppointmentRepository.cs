using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Interfaces.IAppointment
{
    public interface IAppointmentRepository
    {
        Task<List<PatientAppointmentModel>> GetMyAppointmentsAsync(int patientId);
        Task<List<SpecialityModel>> GetSpecialitiesAsync(string? doctorName, string? departmentName);
        Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(int doctorId);
        Task<AppointmentDetailModel> GetAppointmentById(int appointmentId);
        Task<ResponseModel> CreateAppointmentAsync(AppointmentMasterModel model);
        Task<ResponseModel> UpdateAppointmentDetailAsync(UpdateAppointmentRequestModel model);
        Task<ResponseModel> CancelAppointmentByIdAsync(int appointmentId, int patientId);
    }
}
