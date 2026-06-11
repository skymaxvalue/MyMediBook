using MediatR;
using Medicare.Application.Features.Queries.RxOrder;
using Medicare.Application.Interfaces.IOrders;
using Medicare.Application.Models.Orders;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetRxOrderByPatientIdQueryHandler : IRequestHandler<GetRxOrderByPatientIdQuery, List<RxOrderDetailModel>>
    {
        private readonly IRxOrderRepository _rxRepository;

        public GetRxOrderByPatientIdQueryHandler(IRxOrderRepository rxRepository)
        {
            _rxRepository = rxRepository;
        }

        public async Task<List<RxOrderDetailModel>> Handle(GetRxOrderByPatientIdQuery request,  CancellationToken cancellationToken)
        {
            return await _rxRepository.GetRxOrderByPatientIdAsync(request.patientId);
        }
    }
}
