using Medicare.Application.Features.Commands.User;
using Medicare.Application.Interfaces.Dapper;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.ISecurityQuestionsRepository;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.DAL.Persistence.Dapper;
using Medicare.DAL.Persistence.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using System.Reflection;

namespace Medicare_API.Registrars
{
    public class MVCRegistrar : IWebApplicationBuilderRegistrar
    {
        public void RegisterServices(WebApplicationBuilder builder)
        {

            builder.Services.AddControllers();

            builder.Services.AddApiVersioning(config =>
            {
                config.DefaultApiVersion = new ApiVersion(1, 0);
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
                config.ApiVersionReader = new UrlSegmentApiVersionReader();
            });

            builder.Services.AddVersionedApiExplorer(config =>
            {
                config.GroupNameFormat = "'v'VVV";
                config.SubstituteApiVersionInUrl = true;
            });

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(UserCommand).Assembly)
            );

            // ✅ Repository
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();
            builder.Services.AddScoped<ISecurityQuestionsRepository, SecurityQuestionMasterRepository>();
            builder.Services.AddScoped<IErrorLogRepository, ErrorLogRepository>();

            // ✅ Dapper Context
            builder.Services.AddScoped<DapperContext>();

            // ✅ Connection Factory
            builder.Services.AddScoped<IDbConnectionFactory, DapperConnectionFactory>();

        }
    }
}
