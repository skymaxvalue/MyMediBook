using MediatR;
using Medicare.Application.Features.Queries.Dashboard;
using Medicare.Application.Interfaces.IDashboard;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetTodaysPatientQueueQueryHandler : IRequestHandler<GetTodaysPatientQueueQuery, List<PatientQueueDataModel>>
    {
        private readonly IDashboardRepository _dashboardRepository;
        public GetTodaysPatientQueueQueryHandler(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<List<PatientQueueDataModel>> Handle(GetTodaysPatientQueueQuery request, CancellationToken cancellationToken)
        {
            return await _dashboardRepository.GetTodaysPatientQueueAsync(request.model);
        }
    }
}
