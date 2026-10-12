using MediatR;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Commands.Patient
{
    public record SearchPatientInAppointmentsCommand(SearchPatientRequestModel model) : IRequest<List<SearchPatientResponseModel>>;
}
