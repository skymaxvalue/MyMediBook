using MediatR;
using Medicare.Application.Features.Queries.Claim;
using Medicare.Application.Interfaces.IClaim;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetClaimAuditQueryHandler : IRequestHandler<GetClaimAuditQuery, ClaimAuditResponse>
    {
        private readonly IClaimRepostitory _claimRepostitory;
        public GetClaimAuditQueryHandler(IClaimRepostitory claimRepostitory) 
        {
            _claimRepostitory = claimRepostitory;
        }
        public async Task<ClaimAuditResponse> Handle(GetClaimAuditQuery request, CancellationToken cancellationToken)
        {
            return await _claimRepostitory.GetClaimAuditById(request.claimId);
        }
    }
}
