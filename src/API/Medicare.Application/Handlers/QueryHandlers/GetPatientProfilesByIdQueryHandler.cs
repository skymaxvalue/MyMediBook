using MediatR;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPatientProfilesByIdQueryHandler : IRequestHandler<GetPatientProfilesByIdQuery, List<PatientProfileModel>>
    {
        private readonly IPatientRepository _patientRepository;
        public GetPatientProfilesByIdQueryHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<List<PatientProfileModel>> Handle(GetPatientProfilesByIdQuery request, CancellationToken cancellationToken)
        {
            return await _patientRepository.GetPatientProfilesById(request.patientId);
        }
    }
}
