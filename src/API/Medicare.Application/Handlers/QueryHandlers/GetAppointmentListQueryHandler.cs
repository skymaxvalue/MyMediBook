using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetAppointmentListQueryHandler : IRequestHandler<GetAppointmentListQuery, List<AppointmentDetailModel>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public GetAppointmentListQueryHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<List<AppointmentDetailModel>> Handle(GetAppointmentListQuery request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.GetFrontOfficeAppointmentsList(request.model);
        }
    }
}
