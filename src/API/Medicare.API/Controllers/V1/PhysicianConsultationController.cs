using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Medicare.Application.Models.Consultation;
using Medicare.Application.Models.PhysicianConsultation;
using Medicare.Application.Features.Queries.Consultation;
using Medicare.Application.Features.Commands.Consultation;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class PhysicianConsultationController : BaseApiController
    {
        private readonly IMediator _mediator;
        public PhysicianConsultationController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        [Route("CreatePhysicianConsultation")]
        public async Task<IActionResult> CreatePhysicianConsultation(CreatePhysicianConsultationRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);

            CreateConsultationResponseModel response = new CreateConsultationResponseModel();
            response = await _mediator.Send(new CreatePhysicianConsultationCommand(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("GetConsultationsByAssociateId")]
        public async Task<IActionResult> GetConsultationsByAssociateId(GetConsultationsRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            model.AssociateId = int.Parse(User.FindFirst("RefId")!.Value);

            ConsultationListResponseModel response = new ConsultationListResponseModel();
            response = await _mediator.Send(new GetConsultationsByAssociateIdQuery(model));
            return HandleResponse(response);
        }

        [HttpPost]
        [Route("GetConsultationsByReceptionistId")]
        public async Task<IActionResult> GetConsultationsByReceptionistId(GetConsultationsRequestModel model)
        {
            model.HospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);
            model.AssociateId = int.Parse(User.FindFirst("RefId")!.Value);

            ConsultationListResponseModel response = new ConsultationListResponseModel();
            response = await _mediator.Send(new GetConsultationsByReceptionistIdQuery(model));
            return HandleResponse(response);
        }

        [HttpGet]
        [Route("GetConsultationById/{consultationId}")]
        public async Task<IActionResult> GetConsultationById(int consultationId)
        {
            int hospitalId = int.Parse(User.FindFirst("ActiveHospitalId")!.Value);

            ConsultationDetailModel response = await _mediator.Send(new GetConsultationByIdQuery(consultationId, hospitalId));
            return HandleResponse(response);
        }
    }
}