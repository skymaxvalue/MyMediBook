using Medicare.Application.Features.Commands.User;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.DAL.Persistence.Repositories;
using Medicare_API.Extensions;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

var builder = WebApplication.CreateBuilder(args);

builder.RegistrarServices(typeof(Program));


var app = builder.Build();

app.RegisterPipelineComponents(typeof(Program));

app.Run();
