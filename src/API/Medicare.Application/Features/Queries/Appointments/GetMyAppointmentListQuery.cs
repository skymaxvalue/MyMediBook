using MediatR;
using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Features.Queries.Appointments
{
    public record GetMyAppointmentListQuery(int PatientId)
       : IRequest<List<PatientAppointmentModel>>;
}
