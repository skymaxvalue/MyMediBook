using MediatR;
using Medicare.Application.Models.Billing;

namespace Medicare.Application.Features.Commands.Claim
{
    public record AddConsultationCommand(AddConsultationRequest Request) : IRequest<LineItemResponse>;
}
