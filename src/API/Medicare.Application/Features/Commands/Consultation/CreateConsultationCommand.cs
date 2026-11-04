using MediatR;
using Medicare.Application.Models.Consultation;
using Medicare.Application.Models.Consultation.Medicare.Application.Models.Consultation;

namespace Medicare.Application.Features.Commands.Consultation
{
    public record CreateConsultationCommand(ConsultationMasterModel model) : IRequest<ConsultationResponseModel>;
}
