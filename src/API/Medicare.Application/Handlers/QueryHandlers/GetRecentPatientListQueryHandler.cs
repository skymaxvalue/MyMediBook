using MediatR;
using Medicare.Application.Features.Queries.Dashboard;
using Medicare.Application.Interfaces.IDashboard;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetRecentPatientListQueryHandler : IRequestHandler<GetRecentPatientListQuery, List<RecentPatientDataModel>>
    {
        private readonly IDashboardRepository _dashboardRepository;
        public GetRecentPatientListQueryHandler(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<List<RecentPatientDataModel>> Handle(GetRecentPatientListQuery request, CancellationToken cancellationToken)
        {
            return await _dashboardRepository.GetRecentPatientDetailAsync(request.model);
        }
    }
}
