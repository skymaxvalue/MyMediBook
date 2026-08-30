using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Commands.Claim
{
    public record PostAdjustmentCommand(PostAdjustmentRequest Request) : IRequest<PostAdjustmentResponse>;

}
