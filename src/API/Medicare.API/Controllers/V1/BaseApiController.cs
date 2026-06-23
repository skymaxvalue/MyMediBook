using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    public class BaseApiController : ControllerBase
    {
        protected IActionResult HandleResponse<T>(T data) where T : IErrorHandling
        {
            if(data == null)
            {
                return NotFound(new ApiResponse<T>()
                {
                    Data = default,
                    StatusMessage = "An Error Occured While Fetching Data",
                    StatusCode = HttpStatusCode.NotFound,   
                    Result = 0,
                });
            }

            if(data.IsSuccess == 0)
            {
                return BadRequest(new ApiResponse<T>
                {
                    Data = data,
                    StatusMessage = data.ResponseMessage,
                    StatusCode = HttpStatusCode.BadRequest,
                    Result = 0
                });
            }

            return Ok(new ApiResponse<T>
            {
                Data = data,
                StatusMessage = "Data fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            });
        }
        protected IActionResult HandleListResponse<T>(List<T> data)
        {
            if (data == null || !data.Any())
            {
                return NotFound(new ApiResponse<List<T>>
                {
                    Data = new List<T>(),
                    StatusMessage = "No records found.",
                    StatusCode = HttpStatusCode.NotFound,
                    Result = 0
                });
            }

            return Ok(new ApiResponse<List<T>>
            {
                Data = data,
                StatusMessage = "Data fetched successfully.",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            });
        }
    }
}
