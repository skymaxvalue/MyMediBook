using MediatR;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.Authentication;

namespace Medicare.Application.Features.Commands.Associate
{
    public record AuthAssociateCommand(AuthModel model) : IRequest<AssociateDetailModel>;
}
