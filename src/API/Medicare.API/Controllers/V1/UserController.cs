using MediatR;
using Medicare.Application.Features.Queries.SecurityQuestions;
using Medicare.Application.Features.Queries.User;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare_API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            ApiResponse<UserInfoDataModel> ApiResponse = new ApiResponse<UserInfoDataModel>();
            UserInfoDataModel response = new UserInfoDataModel();
            response = await _mediator.Send(new GetUserByIdQuery(id));
            ApiResponse = new ApiResponse<UserInfoDataModel>()
            {
                Data = response,
                StatusMessage = "User Details Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetSecurityQuestionMaster")]
        public async Task<IActionResult> GetSecurityQuestionMaster()
        {
            ApiResponse<List<SecurityQuestionDataModel>> ApiResponse = new ApiResponse<List<SecurityQuestionDataModel>>();
            List<SecurityQuestionDataModel> response = new List<SecurityQuestionDataModel>();
            response = await _mediator.Send(new GetSecurityQuestionMasterQuery());
            ApiResponse = new ApiResponse<List<SecurityQuestionDataModel>>()
            {
                Data = response,
                StatusMessage = "Security Question Master Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
