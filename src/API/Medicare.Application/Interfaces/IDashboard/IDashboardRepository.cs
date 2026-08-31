using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Interfaces.IDashboard
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryModel> GetDashboardSummaryAsync(DashboardDataRequestModel model);
        Task<List<RecentPatientDataModel>> GetRecentPatientDetailAsync(DashboardDataRequestModel model);
        Task<List<PatientQueueDataModel>> GetTodaysPatientQueueAsync(DashboardDataRequestModel model);
    }
}
