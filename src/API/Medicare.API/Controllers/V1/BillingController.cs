using MediatR;
using Medicare.Application.Features.Queries.Billing;
using Medicare.Application.Models.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class BillingController : BaseApiController
    {
        private readonly IMediator _mediator;
        public BillingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetBillByClaimId/{id}")]
        public async Task<IActionResult> GetBillsById(int id)
        {
            BillingSummaryModel response = new BillingSummaryModel();
            response = await _mediator.Send(new GetBillByClaimIdQuery(id));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetBillingListByPatientId/{patientId}")]
        public async Task<IActionResult> GetBillsByPatientId(int patientId)
        {
            List<BillingSummaryModel> response = new List<BillingSummaryModel>();
            response = await _mediator.Send(new GetBillingListByPatientIdQuery(patientId));
            return HandleListResponse(response);
        }

    }
}
