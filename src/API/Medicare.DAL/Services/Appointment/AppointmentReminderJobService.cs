using Medicare.Application.Interfaces.BackgroundJob.IAppointmentReminder;
using Medicare.Application.Interfaces.IEmail;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.BackgroundJob.Appointment;
using Medicare.Application.Models.CommonModels.Email;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Microsoft.Extensions.Configuration;

namespace Medicare.DAL.Services.Appointment
{
    public class AppointmentReminderJobService
    {
        private readonly IAppointmentReminderRepository _reminderRepository;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IErrorLogRepository _errorLog;
        public AppointmentReminderJobService(
            IAppointmentReminderRepository reminderRepository,
            IEmailService emailService,
            IConfiguration configuration,
            IErrorLogRepository errorLog)
        {
            _reminderRepository = reminderRepository;
            _emailService = emailService;
            _configuration = configuration;
            _errorLog = errorLog;
        }

        // Processes every 30 mins 
        public async Task ProcessRemindersAsync(Guid tenantId)
        {
            int thresholdMins = int.Parse(_configuration["ReminderSettings:ThresholdMins"] ?? "30");
            int cleanupAfterHrs = int.Parse(_configuration["ReminderSettings:CleanupAfterHours"] ?? "2");

            var sAppointmentModel = new StaleAppointmentRequestModel
            {
                TenantId = tenantId,
                ThresholdMins = thresholdMins
            };

            var sAppointmentList = await _reminderRepository.GetStaleAppointmentListAsync(sAppointmentModel);

            if (sAppointmentList == null || !sAppointmentList.Any()) return;

            foreach (var appointment in sAppointmentList)
            {
                bool success = false;
                string error = null;

                try
                {
                    // Route to OTP channel 
                    success = appointment.NotificationChannel switch
                    {
                        "EMAIL" => await SendEmailReminderAsync(appointment),
                        //"SMS" => await SendSmsReminderAsync(appointment),
                        //"WHATSAPP" => await SendWhatsAppReminderAsync(appointment),
                        _ => await SendEmailReminderAsync(appointment)
                    };
                }
                catch (Exception ex)
                {
                    await _errorLog.InsertErrorLog(new ErrorLogModel
                    {
                        IsDBError = false,
                        Error_Message = $"{ ex.Message }; AppointmentId: { appointment.AppointmentId }; AppointmentDate: { appointment.AppointmentDate }",
                        Error_Procedure = "",
                        Error_Trace = ex.StackTrace
                    });
                }

                var updateAppointmentModel = new UpdateAppointmentRequestModel
                {
                    AppointmentId = appointment.AppointmentId,
                    CleanupAfterHours = cleanupAfterHrs,
                    NotificationChannel = appointment.NotificationChannel,
                    ReminderType = "2Hr"
                };

                // Update Reminder 
                await UpdateAppointmentReminderInfo(updateAppointmentModel);
            }
        }

        private async Task UpdateAppointmentReminderInfo(UpdateAppointmentRequestModel model)
        {
            try
            {
                await _reminderRepository.UpdateReminderInfoAsync(model);
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel
                {
                    IsDBError = false,
                    Error_Message = $"{ex.Message}; AppointmentId: {model.AppointmentId}",
                    Error_Procedure = "",
                    Error_Trace = ex.StackTrace
                });
            }
        }

        private async Task<bool> SendEmailReminderAsync(StaleAppointmentModel model)
        {
            var body = $"""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                  <div style="background:#0066cc;padding:24px;text-align:center;">
                    <h1 style="color:white;margin:0;">Action Required</h1>
                    <p style="color:#cce5ff;margin:8px 0 0;">Please confirm your appointment</p>
                  </div>
                  <div style="padding:24px;">
                    <p>Hi <strong>{model.PatientName}</strong>,</p>
                    <p>Your appointment is <strong>pending OTP confirmation</strong>. Please verify your OTP to secure your slot.</p>
                    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                      <tr style="background:#f5f5f5;">
                        <td style="padding:10px;font-weight:bold;width:40%;">Doctor</td>
                        <td style="padding:10px;">{model.DoctorName}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px;font-weight:bold;">Hospital</td>
                        <td style="padding:10px;">{model.HospitalName}</td>
                      </tr>
                      <tr style="background:#f5f5f5;">
                        <td style="padding:10px;font-weight:bold;">Date</td>
                        <td style="padding:10px;">{model.AppointmentDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px;font-weight:bold;">Time</td>
                        <td style="padding:10px;">{model.SlotStartTime}</td>
                      </tr>
                      <tr style="background:#f5f5f5;">
                        <td style="padding:10px;font-weight:bold;">Visit Type</td>
                        <td style="padding:10px;">{model.VisitType}</td>
                      </tr>
                    </table>
                    <div style="text-align:center;margin:24px 0;">
                      <p style="color:#e65c00;font-weight:bold;">⚠️ Your slot will be released if OTP is not verified within 2 hours.</p>
                    </div>
                    <p style="color:#666;font-size:13px;">
                      If you did not book this appointment, please ignore this email.
                    </p>
                  </div>
                  <div style="background:#f5f5f5;padding:16px;text-align:center;">
                    <p style="color:#999;font-size:12px;margin:0;">MediBook — Your Health, Our Priority</p>
                  </div>
                </div>
            """;
            return await _emailService.SendEmailAsync(new EmailModel
            {
                ToEmail = model.PatientEmail,
                ToName = model.PatientName,
                Subject = $"Action Required: Confirm your appointment with {model.DoctorName}",
                Body = body,
                IsHtml = true
            });
        }
        private Task<bool> SendSmsReminderAsync(StaleAppointmentModel a)
        {
            // Integrate SMS provider (Twilio / AWS SNS / MSG91)
            // var message = $"Hi {a.PatientName}, your appointment with {a.DoctorName} on {a.AppointmentDate} at {a.SlotStartTime} is pending confirmation. Please verify your OTP to confirm.";
            // return await _smsService.SendAsync(a.PatientPhone, message);
            return Task.FromResult(false);
        }
        private Task<bool> SendWhatsAppReminderAsync(StaleAppointmentModel a)
        {
            // Integrate WhatsApp provider (Twilio / Meta Cloud API)
            return Task.FromResult(false);
        }
    }
}
