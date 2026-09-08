using MediatR;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Commands.Patient
{
    public record SearchPatientCommand(SearchPatientRequest model) : IRequest<List<PatientProfileModel>>;
}
