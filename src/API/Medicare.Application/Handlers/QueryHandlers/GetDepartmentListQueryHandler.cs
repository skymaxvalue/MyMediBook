using MediatR;
using Medicare.Application.Features.Queries.Department;
using Medicare.Application.Interfaces.IDepartment;
using Medicare.Application.Models.Department;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetDepartmentListQueryHandler : IRequestHandler<GetDepartmentListQuery, List<DepartmentDataModel>>
    {
        private readonly IDepartmentRepository _departmentRepository;

        public GetDepartmentListQueryHandler(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }
        public async Task<List<DepartmentDataModel>> Handle(GetDepartmentListQuery request, CancellationToken cancellationToken)
        {
            return await _departmentRepository.GetDepartmentListAsync();
        }
    }
}
