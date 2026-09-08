using MediatR;
using Medicare.Application.Models.Organization;

namespace Medicare.Application.Features.Queries.Organization
{
    public record GetOrganizationByTenantQuery(Guid tenantId) : IRequest<OrganizationDataModel>;
}
