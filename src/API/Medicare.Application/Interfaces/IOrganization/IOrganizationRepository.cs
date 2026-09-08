using Medicare.Application.Models.Organization;

namespace Medicare.Application.Interfaces.IOrganization
{
    public interface IOrganizationRepository
    {
        Task<OrganizationDataModel> GetOrganizationByTenant(Guid tenantId);
    }
}
