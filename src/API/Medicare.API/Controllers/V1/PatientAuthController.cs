using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientAuthController : BaseApiController
    {
        private readonly IMediator _mediator;
        public PatientAuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("CreatePatientAccount")]
        public async Task<IActionResult> CreatePatientAccount([FromBody] CreatePatientRequestModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreatePatientCommand(model));
            return HandleResponse(response);
        }
    }
}
