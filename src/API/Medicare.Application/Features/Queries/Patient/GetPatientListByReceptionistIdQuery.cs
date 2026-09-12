using MediatR;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Queries.Patient
{
    public record GetPatientListByReceptionistIdQuery(int receptionistId) : IRequest<List<PatientListResponseModel>>;
}
