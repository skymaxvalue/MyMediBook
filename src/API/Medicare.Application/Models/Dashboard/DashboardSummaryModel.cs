using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Dashboard
{
    public class DashboardSummaryModel : IErrorHandling
    {
        public int TotalAppointmentsCount{ get; set; }
        public int TotalWalkinsWaitingCount { get; set; }
        public int TotalCheckInCount { get; set; }
        public int TotalPendingPaymentsCount { get; set; }
        public int TotalLabResultsCount { get; set; }
        public string ResponseMessage { get; set; }
        public int IsSuccess { get; set; }
    }
}
