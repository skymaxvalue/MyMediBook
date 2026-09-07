using MediatR;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.Dashboard;

namespace Medicare.Application.Features.Queries.Dashboard
{
    public record GetRecentPatientListQuery(DataRequestModel model) : IRequest<List<RecentPatientDataModel>>;
}
