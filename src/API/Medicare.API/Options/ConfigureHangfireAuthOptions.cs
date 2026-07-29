using Hangfire.Dashboard;

namespace Medicare.API.Options
{
    public class ConfigureHangfireAuthOptions : IDashboardAuthorizationFilter
    {
        private readonly IWebHostEnvironment _env;
        public ConfigureHangfireAuthOptions(IWebHostEnvironment env)
        {
            _env = env;
        }
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();

            if (_env.IsDevelopment())
            {
                return true;
            }

            return httpContext.User.Identity?.IsAuthenticated == true && httpContext.User.HasClaim("role", "Admin");
        }
    }
}
