using MediatR;
using Medicare.Application.Features.Queries.Organization;
using Medicare.Application.Interfaces.IOrganization;
using Medicare.Application.Models.Organization;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetOrganizationByTenantQueryHandler : IRequestHandler<GetOrganizationByTenantQuery, OrganizationDataModel>
    {
        private readonly IOrganizationRepository _organizationRepository;
        public GetOrganizationByTenantQueryHandler(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }
        public async Task<OrganizationDataModel> Handle(GetOrganizationByTenantQuery request, CancellationToken cancellationToken)
        {
            return await _organizationRepository.GetOrganizationByTenant(request.tenantId);
        }
    }
}
