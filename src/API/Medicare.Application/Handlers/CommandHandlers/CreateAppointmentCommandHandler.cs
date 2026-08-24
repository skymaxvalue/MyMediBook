using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.CommonModels.ResponseModel;
using System.Security.Cryptography;
using System.Text;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, ResponseModel>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public CreateAppointmentCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<ResponseModel> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken) 
        {
            return await _appointmentRepository.CreateAppointmentAsync(request.model);
        } 
    }
}