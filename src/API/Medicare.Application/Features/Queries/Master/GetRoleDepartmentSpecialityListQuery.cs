using MediatR;
using Medicare.Application.Models.MasterModels;

namespace Medicare.Application.Features.Queries.Master
{
    public record GetRoleDepartmentSpecialityListQuery() : IRequest<List<RoleHierarchyModel>>;
}
