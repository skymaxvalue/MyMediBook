using Medicare.Application.Models.BackgroundJob.Appointment;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Interfaces.BackgroundJob.IAppointmentReminder
{
    public interface IAppointmentReminderRepository
    {
        Task<List<StaleAppointmentModel>> GetStaleAppointmentListAsync(StaleAppointmentRequestModel model);
        Task<List<ReleaseableAppointmentModel>> GetReleasableAppointmentsAsync(Guid tenantId);
        Task<ResponseModel> UpdateReminderInfoAsync(UpdateAppointmentRequestModel model);
        Task<ResponseModel> ReleaseAppointmentSlotAsync(ReleaseAppointmentRequestModel model);
    }
}
