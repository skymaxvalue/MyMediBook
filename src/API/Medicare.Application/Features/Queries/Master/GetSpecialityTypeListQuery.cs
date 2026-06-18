using MediatR;
using Medicare.Application.Models.Speciality;

namespace Medicare.Application.Features.Queries.Master
{
    public record GetSpecialityTypeListQuery() : IRequest<List<SpecialityTypeModel>>;
}
