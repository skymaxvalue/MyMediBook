using MediatR;
using Medicare.Application.Models.Hospital;

namespace Medicare.Application.Features.Commands.Patient
{
    public record EnrollPatientInHospitalCommand(int hospitalId, string userId) : IRequest<EnrollPatientResponse>;
}
