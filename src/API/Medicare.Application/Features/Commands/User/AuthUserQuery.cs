using MediatR;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.User;

namespace Medicare.Application.Features.Commands.User
{
    public record AuthUserQuery(AuthModel Model) : IRequest<UserInfoDataModel>;
}
