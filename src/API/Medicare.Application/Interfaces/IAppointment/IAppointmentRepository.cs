using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Interfaces.IAppointment
{
    public interface IAppointmentRepository
    {
        Task<List<PatientAppointmentModel>> GetMyAppointmentsAsync(int patientId);
        Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(int associateId);
        Task<AppointmentDetailModelDto> GetAppointmentById(int appointmentId);
        Task<ResponseModel> CreateAppointmentAsync(AppointmentMasterModel model);
        Task<ResponseModel> UpdateAppointmentDetailAsync(UpdateAppointmentRequestModel model);
        Task<ResponseModel> CancelAppointmentByIdAsync(int appointmentId, int patientId);
    }
}
