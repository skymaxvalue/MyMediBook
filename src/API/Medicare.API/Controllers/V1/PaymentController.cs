using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Medicare.Application.Models.Payments;
using Medicare.Application.Features.Queries.Payment;

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

        [HttpPost]
        [Route("GetPaymentRecordsByPatientId/{patientId}")]
        public async Task<IActionResult> GetPaymentRecordsByPatientId(GetPaymentRecordsRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            List<PaymentRecordModel> response = new List<PaymentRecordModel>();
            response = await _mediator.Send(new GetPaymentRecordsByPatientIdQuery(model));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetPaymentRecordById/{paymentRecordId}")]
        public async Task<IActionResult> GetPaymentRecordById(int paymentRecordId)
        {
            int hospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            PaymentRecordModel response = new PaymentRecordModel();
            response = await _mediator.Send(new GetPaymentRecordByIdQuery(paymentRecordId, hospitalId));
            return HandleResponse(response);
        }
    }
}  