using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Features.Queries.SecurityQuestions;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : BaseApiController
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("SignUpUser")]
        public async Task<IActionResult> SignUpUser([FromBody] UserModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UserCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("RequestOtp")]
        public async Task<IActionResult> RequestOtp([FromBody] RequestOtpModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new RequestOtpCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new VerifyOtpCommand(model));
            return HandleResponse(response);
        }


        [HttpGet]
        [Route("GetSecurityQuestionList")]
        public async Task<IActionResult> GetSecurityQuestionList()
        {
            List<SecurityQuestionDataModel> response = new List<SecurityQuestionDataModel>();
            response = await _mediator.Send(new GetSecurityQuestionListQuery());
            return HandleListResponse(response);
        }
    }
}
