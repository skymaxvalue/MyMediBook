using MediatR;
using Medicare.Application.Models.Billing;

namespace Medicare.Application.Features.Queries.Billing
{
    public record GetBillByClaimIdQuery(int id) : IRequest<BillingSummaryModel>;
}
