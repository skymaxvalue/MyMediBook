using MediatR;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.User;

namespace Medicare.Application.Features.Commands.Authentication
{
    public record AuthUserCommand(AuthModel Model) : IRequest<UserInfoDataModel>;
}
