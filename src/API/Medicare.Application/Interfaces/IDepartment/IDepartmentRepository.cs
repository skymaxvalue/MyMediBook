using Medicare.Application.Models.Department;

namespace Medicare.Application.Interfaces.IDepartment
{
    public interface IDepartmentRepository
    {
        Task<List<DepartmentDataModel>> GetDepartmentListAsync();
    }
}
