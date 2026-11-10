using MediatR;
using Medicare.Application.Features.Commands.Consultation;
using Medicare.Application.Interfaces.IConsultation;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Consultation;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateConsultationCommandHandler: IRequestHandler<CreateConsultationCommand, ConsultationResponseModel>
    {
        private readonly IConsultationRepository _consultationRepository;

        public CreateConsultationCommandHandler(IConsultationRepository consultationRepository)
        {
            _consultationRepository = consultationRepository;
        }

        public async Task<ConsultationResponseModel> Handle(CreateConsultationCommand request, CancellationToken cancellationToken)
        {
            return await _consultationRepository.CreateConsultationAsync(request.model);
        }
    }
}
