using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Queries.Billing
{
    public record GetBillByClaimIdQuery(int id) : IRequest<BillingSummaryModel>;
}
