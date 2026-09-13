using Medicare.Application.Models.Organization;

namespace Medicare.Application.Interfaces.IOrganization
{
    public interface IOrganizationRepository
    {
        Task<List<OrganisationDataModel>> GetOrganizationList();
        Task<OrganisationDataModel> GetOrganizationByTenant(Guid tenantId);
    }
}
