using MediatR;
using Medicare.Application.Features.Commands.Claim;
using Medicare.Application.Features.Queries.Claim;
using Medicare.Application.Models.Billing;
using Medicare.Application.Models.Claim;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    public class ClaimController : Controller
    {
        [ApiVersion("1.0")]
        [Route("api/v{version:apiVersion}/[controller]")]
        [ApiController]
        [Authorize]
        public class ClaimsController : ControllerBase
        {
            private readonly IMediator _mediator;
            public ClaimsController(IMediator mediator) => _mediator = mediator;

            [HttpPost]
            [Route("CreateClaim")]
            public async Task<IActionResult> CreateClaim(CreateClaimRequest request)
            {
                CreateClaimResponse response = new CreateClaimResponse();
                response = await _mediator.Send(new CreateClaimCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Consultation")]
            public async Task<IActionResult> AddConsultation(int claimId, [FromBody] AddConsultationRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddConsultationCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/LabTest")]
            public async Task<IActionResult> AddLabTest(int claimId, [FromBody] AddLabTestRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddLabTestCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Scan")]
            public async Task<IActionResult> AddScan(
                int claimId, [FromBody] AddScanRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddScanCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/ICU")]
            public async Task<IActionResult> AddICU(
                int claimId, [FromBody] AddICURequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddICUCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/BedCharge")]
            public async Task<IActionResult> AddBedCharge(
                int claimId, [FromBody] AddBedChargeRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddBedChargeCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Surgery")]
            public async Task<IActionResult> AddSurgery(
                int claimId, [FromBody] AddSurgeryRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddSurgeryCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Pharmacy")]
            public async Task<IActionResult> AddPharmacy(
                int claimId, [FromBody] AddPharmacyRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddPharmacyCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Nursing")]
            public async Task<IActionResult> AddNursing(
                int claimId, [FromBody] AddNursingRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddNursingCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Consumable")]
            public async Task<IActionResult> AddConsumable(
                int claimId, [FromBody] AddConsumableRequest request)
            {
                request.ClaimId = claimId;
                LineItemResponse response = new LineItemResponse();
                response = await _mediator.Send(new AddConsumableCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/SubmitClaim")]
            public async Task<IActionResult> SubmitClaim(int claimId)
            {
                SubmitClaimResponse response = new SubmitClaimResponse();
                response = await _mediator.Send(new SubmitClaimCommand(claimId));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Nursing")]
            public async Task<IActionResult> PostInsurancePayment(
                int claimId, [FromBody] PostInsurancePaymentRequest request)
            {
                request.ClaimId = claimId;
                PostInsurancePaymentResponse response = new PostInsurancePaymentResponse();
                response = await _mediator.Send(new PostInsurancePaymentCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/Adjustment")]
            public async Task<IActionResult> PostAdjustment(
                int claimId, [FromBody] PostAdjustmentRequest request)
            {
                request.ClaimId = claimId;
                PostAdjustmentResponse response = new PostAdjustmentResponse();
                response = await _mediator.Send(new PostAdjustmentCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/CalculateResponsibility")]
            public async Task<IActionResult> CalculateResponsibility(
                int claimId, [FromBody] CalculateResponsibilityRequest request)
            {
                request.ClaimId = claimId;
                CalculateResponsibilityResponse response = new CalculateResponsibilityResponse();
                response = await _mediator.Send(new CalculateResponsibilityCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/GenerateStatement")]
            public async Task<IActionResult> GenerateStatement(int claimId)
            {
                GenerateStatementResponse response = new GenerateStatementResponse();
                response = await _mediator.Send(new GenerateStatementCommand(claimId));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/PatientPayment")]
            public async Task<IActionResult> PostPatientPayment(
                int claimId, [FromBody] PostPatientPaymentRequest request)
            {
                request.ClaimId = claimId;
                PostPatientPaymentResponse response = new PostPatientPaymentResponse();
                response = await _mediator.Send(new PostPatientPaymentCommand(request));
                return Ok(response);
            }

            [HttpPost]
            [Route("{claimId}/ForwardToSecondaryClaim")]
            public async Task<IActionResult> ForwardToSecondary(
                int claimId, [FromBody] ForwardToSecondaryRequest request)
            {
                request.ClaimId = claimId;
                ForwardToSecondaryResponse response = new ForwardToSecondaryResponse();
                response = await _mediator.Send(new ForwardToSecondaryCommand(request));
                return Ok(response);
            }

            [HttpGet]
            [Route("{claimId}/Audit")]
            public async Task<IActionResult> GetAuditTrail(int claimId)
            {
                ClaimAuditResponse response = new ClaimAuditResponse();
                response = await _mediator.Send(new GetClaimAuditQuery(claimId));
                return Ok(response);
            }
        }
    }
}
