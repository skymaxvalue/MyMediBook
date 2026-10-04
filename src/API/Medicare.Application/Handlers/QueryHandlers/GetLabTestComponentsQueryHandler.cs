using MediatR;
using Medicare.Application.Features.Queries.Lab;
using Medicare.Application.Interfaces.ILab;
using Medicare.Application.Models.Doctor;
using Medicare.Application.Models.Lab;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetLabTestComponentsQueryHandler : IRequestHandler<GetLabTestComponentsQuery, List<LabTestCategoryModel>>
    {
        private readonly ILabRepository _labRepository;
        public GetLabTestComponentsQueryHandler(ILabRepository labRepository)
        {
            _labRepository = labRepository;
        }
        public async Task<List<LabTestCategoryModel>> Handle(GetLabTestComponentsQuery request, CancellationToken cancellationToken)
        {
            var result = await _labRepository.GetLabTestComponentsAsync();
            var returnData = result
             .GroupBy(x => new
             {
                 x.TestId,
                 x.TestCode,
                 x.TestName
             })
            .Select(g => new LabTestCategoryModel
            {
                TestId = g.Key.TestId,
                TestCode = g.Key.TestCode,
                TestName = g.Key.TestName,
                Components = g.Select(d => new LabTestComponentsModel
                {
                    ComponentId = d.ComponentId,
                    ComponentName = d.ComponentName,
                    UnitId = d.UnitId,
                    UnitName = d.UnitName,
                    DisplayOrder = d.DisplayOrder
                }).ToList()
            })
            .ToList();
            return returnData;
        }
    }
}
