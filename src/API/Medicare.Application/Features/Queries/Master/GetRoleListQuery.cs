using MediatR;
using Medicare.Application.Models.MasterModels;

namespace Medicare.Application.Features.Queries.Master
{
    public record GetRoleListQuery() : IRequest<List<RoleDataModel>>;
}
