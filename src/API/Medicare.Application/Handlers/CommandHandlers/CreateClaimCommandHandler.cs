using MediatR;
using Medicare.Application.Features.Commands.Claim;
using Medicare.Application.Interfaces.IClaim;
using Medicare.Application.Models.Claim;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateClaimCommandHandler : IRequestHandler<CreateClaimCommand, CreateClaimResponse>
    {
        private readonly IClaimRepostitory _claimRepository;
        public CreateClaimCommandHandler(IClaimRepostitory claimRepostitory)
        {
            _claimRepository = claimRepostitory;
        }
        public async Task<CreateClaimResponse> Handle(CreateClaimCommand request, CancellationToken cancellationToken)
        {
            return await _claimRepository.CreateClaimAsync(request.model);
        }
    }
}
