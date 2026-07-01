using MediatR;
using Medicare.Application.Features.Queries.Associate;
using Medicare.Application.Interfaces.IAssociate;
using Medicare.Application.Models.Associate;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetAssociateDetailByIdQueryHandler : IRequestHandler<GetAssociateDetailByIdQuery, AssociateDetailModel>
    {
        private readonly IAssociateRepository _associateRepository;
        public GetAssociateDetailByIdQueryHandler(IAssociateRepository associateRepository)
        {
            _associateRepository = associateRepository;
        }
        public async Task<AssociateDetailModel> Handle(GetAssociateDetailByIdQuery request, CancellationToken cancellationToken)
        {
            return await _associateRepository.GetAssociateDetailByIdAsync(request.associateId);
        }
    }
}
