using Medicare_API.Registrars;
using Microsoft.EntityFrameworkCore;

namespace Medicare.API.Registrars
{
    public class DBRegistrar : IWebApplicationBuilderRegistrar
    {
        public void RegisterServices(WebApplicationBuilder builder)
        {
            var cs = builder.Configuration.GetConnectionString("Default");
            builder.Services.AddDbContext<DbContext>(options => options.UseSqlServer(cs));
        }
    }
}
