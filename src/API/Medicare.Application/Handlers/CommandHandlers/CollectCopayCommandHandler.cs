using MediatR;
using Medicare.Application.Features.Commands.Claim;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CollectCopayCommandHandler : IRequestHandler<CollectCopayCommand, CollectCopayResponse>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public CollectCopayCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<CollectCopayResponse> Handle(CollectCopayCommand request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.CollectCopayAsync(request.model);
        }
    }
}
