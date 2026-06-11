using MediatR;
using Medicare.Application.Features.Commands.RxOrder;
using Medicare.Application.Features.Queries.RxOrder;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Orders;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class RxOrderController : Controller
    {
        private readonly IMediator _mediator;
        public RxOrderController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CreateRxOrder")]
        public async Task<IActionResult> CreateRxOrder(CreateRxOrderRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateRxOrderCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpPut]
        [Route("UpdateRxOrder")]
        public async Task<IActionResult> UpdateRxOrder(UpdateRxOrderRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new UpdateRxOrderCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpDelete]
        [Route("CancelRxOrder")]
        public async Task<IActionResult> CancelRxOrder(CancelRxOrderRequestModel model)
        {
            ApiResponse<ResponseModel> ApiResponse = new ApiResponse<ResponseModel>();
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CancelRxOrderCommand(model));
            ApiResponse = new ApiResponse<ResponseModel>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetRxOrderByOrderId/{orderId}")]
        public async Task<IActionResult> GetRxOrderByOrderId(int orderId)
        {
            ApiResponse<RxOrderDetailModel> ApiResponse = new ApiResponse<RxOrderDetailModel>();
            RxOrderDetailModel response = new RxOrderDetailModel();
            response = await _mediator.Send(new GetRxOrderByOrderIdQuery(orderId));
            ApiResponse = new ApiResponse<RxOrderDetailModel>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetRxOrderByPatientId/{patientId}")]
        public async Task<IActionResult> GetRxOrderByPatientId(int patientId)
        {
            ApiResponse<List<RxOrderDetailModel>> ApiResponse = new ApiResponse<List<RxOrderDetailModel>>();
            List<RxOrderDetailModel> response = new List<RxOrderDetailModel>();
            response = await _mediator.Send(new GetRxOrderByPatientIdQuery(patientId));
            ApiResponse = new ApiResponse<List<RxOrderDetailModel>>()
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
