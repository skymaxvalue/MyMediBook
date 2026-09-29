using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Models.Patient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class ReceptionistAuthController : BaseApiController
    {
        private readonly IMediator _mediator;
        public ReceptionistAuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = "Receptionist")]
        [HttpPost]
        [Route("Receptionist/CreatePatientAccount")]
        public async Task<IActionResult> CreateFrontOfficePatientAccount([FromBody] CreateFrontOfficePatientRequestModel model)
        {
            model.AssociateId = int.Parse(User.FindFirst("RefId")!.Value);
            CreateFrontOfficePatientResponseModel response = new CreateFrontOfficePatientResponseModel();
            response = await _mediator.Send(new CreateFrontOfficePatientCommand(model));
            return HandleResponse(response);
        }
    }
}
