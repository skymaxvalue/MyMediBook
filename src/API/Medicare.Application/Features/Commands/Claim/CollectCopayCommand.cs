using MediatR;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Features.Commands.Claim
{
    public record CollectCopayCommand(CollectCopayRequest Request) : IRequest<CollectCopayResponse>;
}
