using MediatR;
using Medicare.Application.Models.Consultation;

namespace Medicare.Application.Features.Queries.Consultation
{
    public record GetConsultationsByReceptionistIdQuery(GetConsultationsRequestModel model) : IRequest<ConsultationListResponseModel>;
}
