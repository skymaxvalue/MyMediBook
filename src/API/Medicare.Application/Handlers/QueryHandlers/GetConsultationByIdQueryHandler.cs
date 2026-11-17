using MediatR;
using Medicare.Application.Models.Consultation;
using Medicare.Application.Features.Queries.Consultation;
using Medicare.Application.Interfaces.IPhysicianConsultation;

public class GetConsultationByIdQueryHandler : IRequestHandler<GetConsultationByIdQuery, ConsultationDetailModel>
{
    private readonly IConsultationRepository _repository;
    public GetConsultationByIdQueryHandler(IConsultationRepository repository) => _repository = repository;

    public async Task<ConsultationDetailModel> Handle(GetConsultationByIdQuery request, CancellationToken ct)
    {
        return await _repository.GetConsultationByIdAsync(request.consultationId, request.hospitalId);
    }
}