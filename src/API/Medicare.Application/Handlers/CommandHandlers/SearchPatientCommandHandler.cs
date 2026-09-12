using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class SearchPatientCommandHandler : IRequestHandler<SearchPatientCommand, List<SearchPatientResponseModel>>
    {
        private readonly IPatientRepository _patientRepository;
        public SearchPatientCommandHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<List<SearchPatientResponseModel>> Handle(SearchPatientCommand request, CancellationToken cancellationToken)
        {
            return await _patientRepository.SearchPatientAsync(request.model);
        }
    }
}
