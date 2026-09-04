using MediatR;
using Medicare.Application.Features.Queries.Dashboard;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : BaseApiController
    {
        private readonly IMediator _mediator;
        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("Receptionist/GetDashboardSummary")]
        public async Task<IActionResult> GetDashboardSummary(DataRequestModel model)
        {
            DashboardSummaryModel response = new DashboardSummaryModel();
            response = await _mediator.Send(new GetDashboardSummaryQuery(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("Receptionist/GetRecentPatientList")]
        public async Task<IActionResult> GetDashbGetRecentPatientListoardSummary(DataRequestModel model)
        {
            List<RecentPatientDataModel> response = new List<RecentPatientDataModel>();
            response = await _mediator.Send(new GetRecentPatientListQuery(model));
            return HandleListResponse(response);
        }

        [HttpPost]
        [Route("Receptionist/GetPatientQueueList")]
        public async Task<IActionResult> GetPatientQueueList(DataRequestModel model)
        {
            List<PatientQueueDataModel> response = new List<PatientQueueDataModel>();
            response = await _mediator.Send(new GetTodaysPatientQueueQuery(model));
            return  HandleListResponse(response);
        }
    }
}
