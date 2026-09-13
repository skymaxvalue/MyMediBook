using MediatR;
using Medicare.Application.Features.Queries.Organization;
using Medicare.Application.Interfaces.IOrganization;
using Medicare.Application.Models.Organization;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetOrganisationListQueryHandler : IRequestHandler<GetOrganisationListQuery, List<OrganisationDataModel>>
    {
        private readonly IOrganizationRepository _organizationRepository;
        public GetOrganisationListQueryHandler(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }
        public async Task<List<OrganisationDataModel>> Handle(GetOrganisationListQuery request, CancellationToken cancellationToken)
        {
            return await _organizationRepository.GetOrganizationList();
        }
    }
}
