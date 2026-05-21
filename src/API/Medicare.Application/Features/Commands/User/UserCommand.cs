using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;

namespace Medicare.Application.Features.Commands.User
{
    public record UserCommand(UserModel Model) : IRequest<ResponseModel>;
}
