using Medicare.Application.Models.Consultation;
using Medicare.Application.Models.Consultation.Medicare.Application.Models.Consultation;

namespace Medicare.Application.Interfaces.IConsultation
{
    public interface IConsultationRepository
    {
        Task<ConsultationResponseModel> CreateConsultationAsync(ConsultationMasterModel model);
    }
}
