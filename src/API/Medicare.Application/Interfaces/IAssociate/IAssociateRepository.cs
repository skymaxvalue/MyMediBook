using Medicare.Application.Models.Associate;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Interfaces.IAssociate
{
    public interface IAssociateRepository
    {
        Task<ResponseModel> RegisterAssociateAsync(RegisterAssociateModel model);
        Task<ResponseModel> CreateAssociateScheduleAsync(AssociateScheduleModel model); 
        Task<AssociateDetailModel> GetAssociateDetailByIdAsync(int associateId);
    }
}
