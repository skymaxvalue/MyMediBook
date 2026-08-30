using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Queries.Claim
{
    public record GetClaimAuditQuery(int ClaimId) : IRequest<ClaimAuditResponse>;
}
