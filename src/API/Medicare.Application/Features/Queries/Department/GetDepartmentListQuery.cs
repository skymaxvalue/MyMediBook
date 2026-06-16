using MediatR;
using Medicare.Application.Models.Department;

namespace Medicare.Application.Features.Queries.Department
{
    public record GetDepartmentListQuery() : IRequest<List<DepartmentDataModel>>;
}
