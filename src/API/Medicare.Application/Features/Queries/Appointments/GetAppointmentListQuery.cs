using MediatR;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.CommonModels.Request;

namespace Medicare.Application.Features.Queries.Appointments
{
    public record GetAppointmentListQuery(DataRequestFilterModel model) : IRequest<List<AppointmentDetailModel>>;
}
