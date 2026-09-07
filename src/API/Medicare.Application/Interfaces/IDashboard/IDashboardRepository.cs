using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Interfaces.IDashboard
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryModel> GetDashboardSummaryAsync(DataRequestModel model);
        Task<List<RecentPatientDataModel>> GetRecentPatientDetailAsync(DataRequestModel model);
        Task<List<PatientQueueDataModel>> GetTodaysPatientQueueAsync(DataRequestModel model);
    }
}
