using Medicare.Application.Models.Associate;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Interfaces.IAssociate
{
    public interface IAssociateRepository
    {
        Task<ResponseModel> CreateAssociateScheduleAsync(AssociateScheduleModel model); 
        Task<AssociateDetailModel> GetAssociateDetailByIdAsync(int associateId);
        Task<List<AssociateListModel>> GetAssociateListAsync();
        Task<AssociateDetailDto> GetAssociateInfoByUsername(string username);
    }
}
