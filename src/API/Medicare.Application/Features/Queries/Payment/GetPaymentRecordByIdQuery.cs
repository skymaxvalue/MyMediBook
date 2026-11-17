using MediatR;
using Medicare.Application.Models.Payments;

namespace Medicare.Application.Features.Queries.Payment
{
    public record GetPaymentRecordByIdQuery(int paymentRecordId, int hospitalId) : IRequest<PaymentRecordModel>;
}