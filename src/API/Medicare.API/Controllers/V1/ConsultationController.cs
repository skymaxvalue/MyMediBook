using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Medicare.Application.Features.Commands.Consultation;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Consultation.Medicare.Application.Models.Consultation;
using Medicare.Application.Models.Consultation;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class ConsultationController : BaseApiController
    {
        private readonly IMediator _mediator;
        public ConsultationController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [Authorize(Roles = "Receptionist")]
        [HttpPost]
        [Route("CreateConsultation")]
        public async Task<IActionResult> CreateConsultation([FromBody] ConsultationMasterModel model)
        {
            model.AssociateId = int.Parse(User.FindFirst("RefId")!.Value);
            model.HospitalId = int.Parse(User.FindFirst("HospitalId")!.Value);
            ConsultationResponseModel response = new ConsultationResponseModel();
            response = await _mediator.Send(new CreateConsultationCommand(model));
            return HandleResponse(response);
        }
    }
}
