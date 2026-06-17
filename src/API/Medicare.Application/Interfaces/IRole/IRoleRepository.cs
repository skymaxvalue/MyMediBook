using Medicare.Application.Models.Role;

namespace Medicare.Application.Interfaces.IRoles
{
    public interface IRoleRepository
    {
        Task<List<RoleDataModel>> GetRoleListAsync();
    }
}
