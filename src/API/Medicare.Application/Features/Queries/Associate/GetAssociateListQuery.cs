using MediatR;
using Medicare.Application.Models.Associate;

namespace Medicare.Application.Features.Queries.Associate
{
    public record GetAssociateListQuery(int hospitalId) : IRequest<List<AssociateListModel>>;
}
