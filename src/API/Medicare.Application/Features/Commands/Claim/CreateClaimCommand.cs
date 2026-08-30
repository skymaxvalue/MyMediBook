using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Commands.Claim
{
    public record CreateClaimCommand(CreateClaimRequest model) : IRequest<CreateClaimResponse>;
}
