using MediatR;
using Medicare.Application.Features.Commands.Claim;
using Medicare.Application.Features.Queries.Claim;
using Medicare.Application.Models.Billing;
using Medicare.Application.Models.Claim;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class ClaimsController : BaseApiController
    {
        private readonly IMediator _mediator;
        public ClaimsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CreateClaim")]
        public async Task<IActionResult> CreateClaim(CreateClaimRequest request)
        {
            CreateClaimResponse response = new CreateClaimResponse();
            response = await _mediator.Send(new CreateClaimCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Consultation")]
        public async Task<IActionResult> AddConsultation([FromBody] AddConsultationRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddConsultationCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/LabTest")]
        public async Task<IActionResult> AddLabTest([FromBody] AddLabTestRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddLabTestCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Scan")]
        public async Task<IActionResult> AddScan([FromBody] AddScanRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddScanCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/ICU")]
        public async Task<IActionResult> AddICU([FromBody] AddICURequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddICUCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/BedCharge")]
        public async Task<IActionResult> AddBedCharge([FromBody] AddBedChargeRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddBedChargeCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Surgery")]
        public async Task<IActionResult> AddSurgery([FromBody] AddSurgeryRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddSurgeryCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Pharmacy")]
        public async Task<IActionResult> AddPharmacy([FromBody] AddPharmacyRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddPharmacyCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Nursing")]
        public async Task<IActionResult> AddNursing([FromBody] AddNursingRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddNursingCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Consumable")]
        public async Task<IActionResult> AddConsumable([FromBody] AddConsumableRequest request)
        {
            LineItemResponse response = new LineItemResponse();
            response = await _mediator.Send(new AddConsumableCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/SubmitClaim")]
        public async Task<IActionResult> SubmitClaim(int claimId)
        {
            SubmitClaimResponse response = new SubmitClaimResponse();
            response = await _mediator.Send(new SubmitClaimCommand(claimId));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/PostInsurancePayment")]
        public async Task<IActionResult> PostInsurancePayment([FromBody] PostInsurancePaymentRequest request)
        {
            PostInsurancePaymentResponse response = new PostInsurancePaymentResponse();
            response = await _mediator.Send(new PostInsurancePaymentCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/Adjustment")]
        public async Task<IActionResult> PostAdjustment([FromBody] PostAdjustmentRequest request)
        {
            PostAdjustmentResponse response = new PostAdjustmentResponse();
            response = await _mediator.Send(new PostAdjustmentCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/CalculateResponsibility")]
        public async Task<IActionResult> CalculateResponsibility([FromBody] CalculateResponsibilityRequest request)
        {
            CalculateResponsibilityResponse response = new CalculateResponsibilityResponse();
            response = await _mediator.Send(new CalculateResponsibilityCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/GenerateStatement")]
        public async Task<IActionResult> GenerateStatement(int claimId)
        {
            GenerateStatementResponse response = new GenerateStatementResponse();
            response = await _mediator.Send(new GenerateStatementCommand(claimId));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/PatientPayment")]
        public async Task<IActionResult> PostPatientPayment(
            int claimId, [FromBody] PostPatientPaymentRequest request)
        {
            request.ClaimId = claimId;
            PostPatientPaymentResponse response = new PostPatientPaymentResponse();
            response = await _mediator.Send(new PostPatientPaymentCommand(request));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("{claimId}/ForwardToSecondaryClaim")]
        public async Task<IActionResult> ForwardToSecondary(
            int claimId, [FromBody] ForwardToSecondaryRequest request)
        {
            request.ClaimId = claimId;
            ForwardToSecondaryResponse response = new ForwardToSecondaryResponse();
            response = await _mediator.Send(new ForwardToSecondaryCommand(request));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("{claimId}/Audit")]
        public async Task<IActionResult> GetAuditTrail(int claimId)
        {
            ClaimAuditResponse response = new ClaimAuditResponse();
            response = await _mediator.Send(new GetClaimAuditQuery(claimId));
            return HandleResponse(response);
        }
    }
}
