using MediatR;
using Medicare.Application.Features.Queries.Dashboard;
using Medicare.Application.Interfaces.IDashboard;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryModel>
    {
        private readonly IDashboardRepository _dashboardRepository;
        public GetDashboardSummaryQueryHandler(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<DashboardSummaryModel> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
            return await _dashboardRepository.GetDashboardSummaryAsync(request.model);
        }
    }
}
