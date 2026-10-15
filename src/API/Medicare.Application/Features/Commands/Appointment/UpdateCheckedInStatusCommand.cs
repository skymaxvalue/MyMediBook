using MediatR;
using Medicare.Application.Models.Appointment;

namespace Medicare.Application.Features.Commands.Appointment
{
    public record UpdateCheckedInStatusCommand(UpdateCheckedInStatusRequestModel model) : IRequest<AppointmentDetailModel>;
}
