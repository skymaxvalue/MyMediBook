using MediatR;
using Medicare.Application.Models.Orders;

namespace Medicare.Application.Features.Queries.RxOrder 
{
    public record GetRxOrderByPatientIdQuery(int patientId) : IRequest<List<RxOrderDetailModel>>;
}
