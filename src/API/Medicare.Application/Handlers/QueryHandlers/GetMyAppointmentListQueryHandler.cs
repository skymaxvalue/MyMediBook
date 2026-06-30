using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetMyAppointmentListQueryHandler
       : IRequestHandler<GetMyAppointmentListQuery, List<PatientAppointmentModel>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public GetMyAppointmentListQueryHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<List<PatientAppointmentModel>> Handle(
            GetMyAppointmentListQuery request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.GetMyAppointmentListAsync(request.PatientId);
        }
    }
}
