using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Commands.Authentication
{
    public record CreateFrontOfficePatientCommand(CreateFrontOfficePatientRequestModel model) : IRequest<CreateFrontOfficePatientResponseModel>;
}
