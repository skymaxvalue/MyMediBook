using MediatR;
using Medicare.Application.Models.Lab;

namespace Medicare.Application.Features.Queries.Lab
{
    public class GetLabTestComponentsQuery : IRequest<List<LabTestCategoryModel>>;
}
