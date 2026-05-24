using MediatR;
using Medicare.Application.Features.Commands.Authentication;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AuthController : Controller
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
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UserCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "User Registered Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("LoginUser")]
        public async Task<IActionResult> LoginUser([FromBody] AuthModel model)
        {
            ApiResponse<UserInfoDataModel> ApiResponse = new ApiResponse<UserInfoDataModel>();
            UserInfoDataModel response = new UserInfoDataModel();
            response = await _mediator.Send(new AuthUserCommand(model));
            ApiResponse = new ApiResponse<UserInfoDataModel>()
            {
                Data = response,
                StatusMessage = "User Logged In Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("RequestOtp")]
        public async Task<IActionResult> RequestOtp([FromBody] RequestOtpModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new RequestOtpCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = response.ResponseMessage,
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPost]
        [Route("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new VerifyOtpCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = response.ResponseMessage,
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
