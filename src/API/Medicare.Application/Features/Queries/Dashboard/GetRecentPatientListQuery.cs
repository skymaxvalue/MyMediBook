using MediatR;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Features.Queries.Dashboard
{
    public record GetRecentPatientListQuery(DashboardDataRequestModel model) : IRequest<List<RecentPatientDataModel>>;
}
