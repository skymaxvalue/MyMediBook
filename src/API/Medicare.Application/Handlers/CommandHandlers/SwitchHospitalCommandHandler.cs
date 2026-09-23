using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Hospital;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class SwitchHospitalCommandHandler : IRequestHandler<SwitchHospitalCommand, SwitchHospitalResponse>
    {
        private readonly IPatientRepository _patientRepository;
        public SwitchHospitalCommandHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<SwitchHospitalResponse> Handle(SwitchHospitalCommand request, CancellationToken cancellationToken)
        {
            return await _patientRepository.SwitchHospitalAsync(request.hospitalId, request.userId);
        }
    }
}
