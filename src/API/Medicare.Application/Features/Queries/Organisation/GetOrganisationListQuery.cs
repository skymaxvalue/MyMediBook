using MediatR;
using Medicare.Application.Models.Organization;

namespace Medicare.Application.Features.Queries.Organization
{
    public record GetOrganisationListQuery() : IRequest<List<OrganisationDataModel>>;
}
