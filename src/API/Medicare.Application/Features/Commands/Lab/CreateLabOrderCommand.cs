using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Lab;

namespace Medicare.Application.Features.Commands.Lab
{
    public record CreateLabOrderCommand(LabOrderRequestModel model) : IRequest<ResponseModel>;
}
