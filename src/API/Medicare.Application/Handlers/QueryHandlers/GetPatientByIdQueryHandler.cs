using MediatR;
using Medicare.Application.Features.Queries.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPatientByIdQueryHandler : IRequestHandler<GetPatientByIdQuery, PatientMasterModel>
    {
        private readonly IPatientRepository _patientRepository;

        public GetPatientByIdQueryHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<PatientMasterModel> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
        {
            return await _patientRepository.GetPatientById(request.Id);
        }
    }
}
