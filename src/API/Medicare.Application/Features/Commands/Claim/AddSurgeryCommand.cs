using MediatR;
using Medicare.Application.Models.Billing;

namespace Medicare.Application.Features.Commands.Claim
{
    public record AddSurgeryCommand(AddSurgeryRequest Request) : IRequest<LineItemResponse>;
}
