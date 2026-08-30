using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Commands.Claim
{
    public record ForwardToSecondaryCommand(ForwardToSecondaryRequest Request) : IRequest<ForwardToSecondaryResponse>;
}
