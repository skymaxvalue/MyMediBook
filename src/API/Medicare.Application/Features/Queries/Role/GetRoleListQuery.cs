using MediatR;
using Medicare.Application.Models.Role;

namespace Medicare.Application.Features.Queries.Role
{
    public record GetRoleListQuery() : IRequest<List<RoleDataModel>>;
}
