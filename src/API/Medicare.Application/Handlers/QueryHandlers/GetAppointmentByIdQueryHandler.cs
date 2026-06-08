using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetAppointmentByIdQueryHandler: IRequestHandler<GetAppointmentByIdQuery, AppointmentDetailModel>
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public GetAppointmentByIdQueryHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<AppointmentDetailModel> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            return await _appointmentRepository.GetAppointmentById(request.AppointmentId);
        }
    }
}
