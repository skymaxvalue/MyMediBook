using MediatR;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Commands.Patient
{
    public record AuthPatientCommand(AuthModel model) : IRequest<PatientDetailModel>;
}
