using MediatR;
using Medicare.Application.Features.Commands.Associate;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class AssociateAuthController : BaseApiController
    {
        private readonly IMediator _mediator;
        public AssociateAuthController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("RegisterAssociate")]
        public async Task<IActionResult> RegisterAssociate(CreateAssociateRequestModel model)
        {
            var tenantId = Guid.Parse(User.FindFirst("TenantId")!.Value);
            model.TenantId = tenantId;
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateAssociateCommand(model));
            return HandleResponse(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ResetAssociatePassword")]
        public async Task<IActionResult> ResetAssociatePassword([FromBody] ResetAssociatePasswordModel model)
        {
            ResponseModel response = new ResponseModel();
            if (string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.Password))
                return BadRequest(new ApiResponse<object>
                {
                    Data = null,
                    StatusMessage = "Token and new password are required.",
                    StatusCode = HttpStatusCode.BadRequest,
                    Result = 0
                });
            response = await _mediator.Send(new ResetPasswordCommand(model));
            return HandleResponse(response);
        }
    }
}
