using MediatR;
using Medicare.Application.Features.Queries.Consultation;
using Medicare.Application.Interfaces.IPhysicianConsultation;
using Medicare.Application.Models.Consultation;

public class GetConsultationsByAssociateIdQueryHandler : IRequestHandler<GetConsultationsByAssociateIdQuery, ConsultationListResponseModel>
{
    private readonly IConsultationRepository _consultationRepository;
    public GetConsultationsByAssociateIdQueryHandler(IConsultationRepository consultationRepository)
    {
        _consultationRepository = consultationRepository;
    }
    public async Task<ConsultationListResponseModel> Handle(GetConsultationsByAssociateIdQuery request, CancellationToken cancellationToken)
    {
        GetConsultationsRequestModel m = request.model;

        if (m.AssociateId <= 0)
            return new ConsultationListResponseModel
            { IsSuccess = 0, Status = 0, ResponseMessage = "Associate Is Required" };

        if (m.FromDate.HasValue && m.ToDate.HasValue && m.FromDate > m.ToDate)
            return new ConsultationListResponseModel
            { IsSuccess = 0, Status = 0, ResponseMessage = "From Date Cannot Be After To Date" };

        if (m.PageNumber < 1) m.PageNumber = 1;
        if (m.PageSize < 1) m.PageSize = 20;
        if (m.PageSize > 100) m.PageSize = 100;

        return await _consultationRepository.GetConsultationsByAssociateIdAsync(m);
    }
}