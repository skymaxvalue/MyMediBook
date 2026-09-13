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
    public class OrganisationController : BaseApiController
    {
        private readonly IMediator _mediator;
        public OrganisationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetOrganisationList")]
        public async Task<IActionResult> GetOrganisationList()
        {
            List<OrganisationDataModel> response = new List<OrganisationDataModel>();
            response = await _mediator.Send(new GetOrganisationListQuery());
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetOrganisationByTenant/{tenantId}")]
        public async Task<IActionResult> GetOrganisationByTenant(Guid tenantId)
        {
            OrganisationDataModel response = new OrganisationDataModel();
            response = await _mediator.Send(new GetOrganisationByTenantQuery(tenantId));
            return HandleResponse(response);
        }
    }
}
