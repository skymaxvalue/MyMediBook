using Medicare.Application.Models.Consultation;
using Medicare.Application.Models.PhysicianConsultation;

namespace Medicare.Application.Interfaces.IPhysicianConsultation
{
    public interface IConsultationRepository
    {
        Task<CreateConsultationResponseModel> CreateConsultationAsync(CreatePhysicianConsultationRequestModel model);
        Task<ConsultationListResponseModel> GetConsultationsByAssociateIdAsync(GetConsultationsRequestModel model);
        Task<ConsultationListResponseModel> GetConsultationsByReceptionistIdAsync(GetConsultationsRequestModel model);
        Task<ConsultationDetailModel> GetConsultationByIdAsync(int consultationId, int hospitalId);
    }
}