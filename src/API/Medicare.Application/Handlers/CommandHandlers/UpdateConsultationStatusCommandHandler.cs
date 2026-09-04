using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class UpdateConsultationStatusCommandHandler : IRequestHandler<UpdateConsultationStatusCommand, ResponseModel>
    {
        public IAppointmentRepository _appointmentRepository;
        public UpdateConsultationStatusCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<ResponseModel> Handle(UpdateConsultationStatusCommand request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.UpdateConsultationStatusAsync(request.model);
        }
    }
}
