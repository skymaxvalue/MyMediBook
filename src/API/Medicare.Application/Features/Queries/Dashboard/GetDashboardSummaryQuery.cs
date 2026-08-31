using MediatR;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Features.Queries.Dashboard
{
    public record GetDashboardSummaryQuery(DashboardDataRequestModel model) : IRequest<DashboardSummaryModel>;
}
