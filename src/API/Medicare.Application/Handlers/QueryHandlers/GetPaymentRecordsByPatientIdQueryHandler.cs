using MediatR;
using Medicare.Application.Features.Queries.Payment;
using Medicare.Application.Interfaces.IPayments;
using Medicare.Application.Models.Payments;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetPaymentRecordsByPatientIdQueryHandler
        : IRequestHandler<GetPaymentRecordsByPatientIdQuery, List<PaymentRecordModel>>
    {
        private readonly IPaymentRepository _paymentRepository;

        public GetPaymentRecordsByPatientIdQueryHandler(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<List<PaymentRecordModel>> Handle(
            GetPaymentRecordsByPatientIdQuery request, CancellationToken cancellationToken)
        {
            return await _paymentRepository.GetPaymentRecordsByPatientIdAsync(request.model);
        }
    }
}