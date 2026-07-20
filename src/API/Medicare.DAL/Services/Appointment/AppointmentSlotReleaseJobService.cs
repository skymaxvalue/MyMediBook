using Medicare.Application.Interfaces.BackgroundJob.IAppointmentReminder;
using Medicare.Application.Models.BackgroundJob.Appointment;

namespace Medicare.DAL.Services.Appointment
{
    public class AppointmentSlotReleaseJobService
    {
        private readonly IAppointmentReminderRepository _reminderRepository;

        public AppointmentSlotReleaseJobService(IAppointmentReminderRepository reminderRepository)
        {
            _reminderRepository = reminderRepository;
        }

        // Processes every 60 mins 
        public async Task ReleaseExpiredSlotsAsync(Guid tenantId)
        {
            var releasable = await _reminderRepository.GetReleasableAppointmentsAsync(tenantId);

            if (releasable == null || !releasable.Any()) return;

            foreach (var appointment in releasable)
            {
                var releaseAppointmentModel = new ReleaseAppointmentRequestModel
                {
                    AppointmentId = appointment.AppointmentId,
                    SlotId = appointment.SlotId,
                };

                await _reminderRepository.ReleaseAppointmentSlotAsync(releaseAppointmentModel);
            }
        }
    }
}
