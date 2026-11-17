using MediatR;
using Medicare.Application.Models.PhysicianConsultation;

namespace Medicare.Application.Features.Commands.Consultation
{
    public record CreatePhysicianConsultationCommand(CreatePhysicianConsultationRequestModel model) : IRequest<CreateConsultationResponseModel>;
}
