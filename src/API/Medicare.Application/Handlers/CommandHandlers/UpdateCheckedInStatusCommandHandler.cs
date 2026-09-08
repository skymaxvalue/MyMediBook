using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class UpdateCheckedInStatusCommandHandler : IRequestHandler<UpdateCheckedInStatusCommand, ResponseModel>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public UpdateCheckedInStatusCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<ResponseModel> Handle(UpdateCheckedInStatusCommand request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.UpdateAppointmentCheckedInStatusAsync(request.model);
        }
    }
}
