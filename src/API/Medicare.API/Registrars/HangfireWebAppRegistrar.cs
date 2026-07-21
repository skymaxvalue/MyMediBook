using Hangfire;
using Medicare.Application.Models.Hospital;
using Medicare.DAL.Persistence.Dapper;
using Medicare.DAL.Services.Appointment;
using Medicare_API.Registrars;

namespace Medicare.API.Registrars
{
    public class HangfireWebAppRegistrar : IWebApplicationRegistrar
    {
        public void RegistrarPipelineComponents(WebApplication app)
        {
            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                // TODO: Replace with [Authorize] when auth middleware is added
                //Authorization = new[] { new () }
            });

            //Scheduling Jobs per Tenant
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IDapperContext>();
            var tenants = db.QueryAsync<HospitalTenantModel>(
                 "SELECT HospitalId, TenantId FROM dbo.HospitalMaster WHERE IsActive = 1")
                .GetAwaiter()
                .GetResult();

            if (tenants == null || !tenants.Any())
            {
                // No tenants yet — jobs will be registered when first tenant is onboarded
                return;
            }

            foreach (var tenant in tenants)
            {
                var tenantId = tenant.TenantId;

                // Reminder job — every 30 mins per tenant
                RecurringJob.AddOrUpdate<AppointmentReminderJobService>(
                    $"appointment-reminder-{tenantId}",
                    job => job.ProcessRemindersAsync(tenantId),
                    "*/30 * * * *"
                );

                // Slot release job — every 60 mins per tenant
                RecurringJob.AddOrUpdate<AppointmentSlotReleaseJobService>(
                    $"slot-release-{tenantId}",
                    job => job.ReleaseExpiredSlotsAsync(tenantId),
                    "0 * * * *"
                );
            }
        }
    }
}
