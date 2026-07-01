using MediatR;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPatientProfileByProfileIdQueryHandler : IRequestHandler<GetRxOrderByPatientProfileIdQuery, PatientProfileModel>
    {
        private readonly IPatientRepository _patientRepository;
        public GetPatientProfileByProfileIdQueryHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<PatientProfileModel> Handle(GetRxOrderByPatientProfileIdQuery request, CancellationToken cancellationToken)
        {
            return await _patientRepository.GetPatientProfileByProfileIdAsync(request.profileId);
        }
    }
}
