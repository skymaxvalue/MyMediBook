using MediatR;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Features.Queries.Dashboard
{
    public record GetTodaysPatientQueueQuery(DashboardDataRequestModel model) : IRequest<List<PatientQueueDataModel>>;
}
