using MediatR;
using Medicare.Application.Features.Queries.Master;
using Medicare.Application.Interfaces.Master;
using Medicare.Application.Models.Master;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetOtpTypeListQueryHandler : IRequestHandler<GetOtpTypeListQuery, List<OtpTypeModel>>
    {
        private readonly IMasterRepository _masterRepository;
        public GetOtpTypeListQueryHandler(IMasterRepository masterRepository)
        {
            _masterRepository = masterRepository;
        }
        public async Task<List<OtpTypeModel>> Handle(GetOtpTypeListQuery request, CancellationToken cancellationToken)
        {
            return await _masterRepository.GetOtpTypeListAsync();
        }
    }
}
