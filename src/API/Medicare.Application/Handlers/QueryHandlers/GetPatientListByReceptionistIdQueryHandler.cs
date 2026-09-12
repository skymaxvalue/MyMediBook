using MediatR;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPatientListByReceptionistIdQueryHandler : IRequestHandler<GetPatientListByReceptionistIdQuery, List<PatientListResponseModel>>
    {
        private readonly IPatientRepository _patientRepository;
        public GetPatientListByReceptionistIdQueryHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<List<PatientListResponseModel>> Handle(GetPatientListByReceptionistIdQuery request, CancellationToken cancellationToken)
        {
            return await _patientRepository.GetPatientListByReceptionsistIdAsync(request.receptionistId);
        }
    }
}
