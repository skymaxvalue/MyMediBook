using MediatR;
using Medicare.Application.Features.Queries.Payment;
using Medicare.Application.Interfaces.IPayments;
using Medicare.Application.Models.Payments;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPaymentRecordByIdQueryHandler : IRequestHandler<GetPaymentRecordByIdQuery, PaymentRecordModel?>
    {
        private readonly IPaymentRepository _paymentRepository;

        public GetPaymentRecordByIdQueryHandler(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<PaymentRecordModel?> Handle(
            GetPaymentRecordByIdQuery request, CancellationToken cancellationToken)
        {
            return await _paymentRepository.GetPaymentRecordByIdAsync(request.paymentRecordId, request.hospitalId);
        }
    }
}