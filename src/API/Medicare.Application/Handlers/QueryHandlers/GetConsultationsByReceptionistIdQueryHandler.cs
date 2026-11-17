using MediatR;
using Medicare.Application.Features.Queries.Consultation;
using Medicare.Application.Interfaces.IPhysicianConsultation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetConsultationsByReceptionistIdQueryHandler : IRequestHandler<GetConsultationsByReceptionistIdQuery, ConsultationListResponseModel>
    {
        private readonly IConsultationRepository _consultationRepository;
        public GetConsultationsByReceptionistIdQueryHandler(IConsultationRepository consultationRepository)
        {
            _consultationRepository = consultationRepository;
        }

        public async Task<ConsultationListResponseModel> Handle(GetConsultationsByReceptionistIdQuery request, CancellationToken cancellationToken)
        {
            var m = request.model;

            if (m.AssociateId <= 0)
                return new ConsultationListResponseModel
                { IsSuccess = 0, Status = 0, ResponseMessage = "Receptionist Is Required" };

            if (m.FromDate.HasValue && m.ToDate.HasValue && m.FromDate > m.ToDate)
                return new ConsultationListResponseModel
                { IsSuccess = 0, Status = 0, ResponseMessage = "From Date Cannot Be After To Date" };

            if (m.PageNumber < 1) m.PageNumber = 1;
            if (m.PageSize < 1) m.PageSize = 20;
            if (m.PageSize > 100) m.PageSize = 100;

            return await _consultationRepository.GetConsultationsByReceptionistIdAsync(m);
        }
    }
}
