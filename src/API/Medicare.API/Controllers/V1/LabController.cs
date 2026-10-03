using MediatR;
using Microsoft.AspNetCore.Mvc;
using Medicare.Application.Models.Lab;
using Microsoft.AspNetCore.Authorization;
using Medicare.Application.Features.Queries.Lab;
using Medicare.Application.Features.Commands.LabResult;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Features.Commands.Lab;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class LabController : BaseApiController
    {
        private readonly IMediator _mediator;
        public LabController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CreateLabOrder")]
        public async Task<IActionResult> CreateLabOrder(LabOrderRequestModel model)
        {
            model.CreatedBy = int.Parse(User.FindFirst("RefId")!.Value);
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateLabOrderCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("CreateLabResult")]
        public async Task<IActionResult> CreateLabResult(LabResultModel model)
        {
            ResponseModel response = new ResponseModel();
            response = await _mediator.Send(new CreateLabResultCommand(model));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetLabTestComponents")]
        public async Task<IActionResult> GetLabTestComponents()
        {
            List<LabTestCategoryModel> response = new List<LabTestCategoryModel>();
            response = await _mediator.Send(new GetLabTestComponentsQuery());
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetLabResultDetailById/{id}")]
        public async Task<IActionResult> GetLabResultDetailById(int id)
        {
            LabResultSummaryModel response = new LabResultSummaryModel();
            response = await _mediator.Send(new GetLabResultDetailByIdQuery(id));
            return HandleResponse(response);
        }
        
        [HttpGet]
        [Route("GetLabResultsByPatientId")]
        public async Task<IActionResult> GetLabResultsByPatientId()
        {
            int patientId = int.Parse(User.FindFirst("RefId")!.Value);
            List<LabResultSummaryModel> response = new List<LabResultSummaryModel>();
            response = await _mediator.Send(new GetLabResultsByPatientIdQuery(patientId));
            return HandleListResponse(response);
        }

        [HttpGet]
        [Route("GetLabResultsByProfileId/{profileId}")]
        public async Task<IActionResult> GetLabResultsByProfileId(int profileId)
        {
            List<LabResultSummaryModel> response = new List<LabResultSummaryModel>();
            response = await _mediator.Send(new GetLabResultsByProfileIdQuery(profileId));
            return HandleListResponse(response);
        }
    }
}