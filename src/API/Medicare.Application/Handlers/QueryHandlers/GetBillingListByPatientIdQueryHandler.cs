using MediatR;
using Medicare.Application.Features.Queries.Billing;
using Medicare.Application.Interfaces.IBilling;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetBillingListByPatientIdQueryHandler : IRequestHandler<GetBillingListByPatientIdQuery, List<BillingSummaryModel>>
    {
        private readonly IBillingRepository _billingRepository;
        public GetBillingListByPatientIdQueryHandler(IBillingRepository billingRepository)
        {
            _billingRepository = billingRepository;
        }
        public async Task<List<BillingSummaryModel>> Handle(GetBillingListByPatientIdQuery request, CancellationToken cancellationToken)
        {
            return await _billingRepository.GetBillingListByPatientIdAsync(request.patientId);
        }
    }
}
