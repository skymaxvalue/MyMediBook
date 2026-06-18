using MediatR;
using Medicare.Application.Features.Queries.Master;
using Medicare.Application.Interfaces.Master;
using Medicare.Application.Models.Speciality;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetSpecialityTypeListQueryHandler : IRequestHandler<GetSpecialityTypeListQuery, List<SpecialityTypeModel>>
    {
        private readonly IMasterRepository _masterRepository;
        public GetSpecialityTypeListQueryHandler(IMasterRepository masterRepository)
        {
            _masterRepository = masterRepository;
        }
        public async Task<List<SpecialityTypeModel>> Handle(GetSpecialityTypeListQuery request, CancellationToken cancellationToken)
        {
            return await _masterRepository.GetSpecialityTypeListAsync();
        }
    }
}
