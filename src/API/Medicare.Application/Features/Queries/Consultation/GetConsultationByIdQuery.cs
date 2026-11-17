using MediatR;
using Medicare.Application.Models.Consultation;

namespace Medicare.Application.Features.Queries.Consultation
{
    public record GetConsultationByIdQuery(int consultationId, int hospitalId) : IRequest<ConsultationDetailModel>;
}
