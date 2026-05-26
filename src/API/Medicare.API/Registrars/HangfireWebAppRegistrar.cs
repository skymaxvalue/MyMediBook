using Hangfire;
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
        }
    }
}
