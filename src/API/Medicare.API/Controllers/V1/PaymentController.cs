using MediatR;
using Medicare.Application.Features.Queries.Payment;
using Medicare.Application.Models.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : BaseApiController
    {
        private readonly IMediator _mediator;
        public PaymentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetPaymentRecordsByPatientId/{patientId}")]
        public async Task<IActionResult> GetPaymentRecordsByPatientId(GetPaymentRecordsRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            List<PaymentRecordModel> response = await _mediator.Send(new GetPaymentRecordsByPatientIdQuery(model));
            return HandleListResponse(response);
        }
    }
}  