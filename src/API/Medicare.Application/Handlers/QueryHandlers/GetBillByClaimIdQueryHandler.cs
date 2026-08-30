using MediatR;
using Medicare.Application.Features.Queries.Billing;
using Medicare.Application.Interfaces.IBilling;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetBillByClaimIdQueryHandler : IRequestHandler<GetBillByClaimIdQuery, BillingSummaryModel>
    {
        private readonly IBillingRepository _billingRepository;
        public GetBillByClaimIdQueryHandler(IBillingRepository billingRepository)
        {
            _billingRepository = billingRepository;
        }
        public async Task<BillingSummaryModel> Handle(GetBillByClaimIdQuery request, CancellationToken cancellationToken)
        {
            return await _billingRepository.GetBillByClaimIdAsync(request.id);
        }
    }
}
