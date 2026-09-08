using MediatR;
using Medicare.Application.Features.Queries.Organization;
using Medicare.Application.Models.Organization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : BaseApiController
    {
        private readonly IMediator _mediator;
        public OrganizationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetOrganisationByTenant/{tenantId}")]
        public async Task<IActionResult> GetOrganisationByTenant(Guid tenantId)
        {
            OrganizationDataModel response = new OrganizationDataModel();
            response = await _mediator.Send(new GetOrganizationByTenantQuery(tenantId));
            return HandleResponse(response);
        }
    }
}
