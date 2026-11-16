using MediatR;
using Medicare.Application.Models.Payments;

namespace Medicare.Application.Features.Queries.Payment
{
    public record GetPaymentRecordsByPatientIdQuery(GetPaymentRecordsRequestModel model) : IRequest<List<PaymentRecordModel>>;
}