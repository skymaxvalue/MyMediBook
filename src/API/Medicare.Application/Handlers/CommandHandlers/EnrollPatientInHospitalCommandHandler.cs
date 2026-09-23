using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Hospital;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class EnrollPatientInHospitalCommandHandler : IRequestHandler<EnrollPatientInHospitalCommand, EnrollPatientResponse>
    {
        private readonly IPatientRepository _patientRepository;
        public EnrollPatientInHospitalCommandHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<EnrollPatientResponse> Handle(EnrollPatientInHospitalCommand request, CancellationToken cancellationToken)
        {
            return await _patientRepository.EnrollPatientInHospital(request.hospitalId, request.userId);
        }
    }
}
