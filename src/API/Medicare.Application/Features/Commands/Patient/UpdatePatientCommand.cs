using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Commands.Patient
{
    public record UpdatePatientCommand(CreatePatientRequestModel model) : IRequest<ResponseModel>;
}
