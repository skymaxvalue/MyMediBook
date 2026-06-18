using Medicare.Application.Models.MasterModels;
using Medicare.Application.Models.Speciality;

namespace Medicare.Application.Interfaces.Master
{
    public interface IMasterRepository
    {
        Task<List<WeekDaysModel>> GetWeekDaysListAsync();
        Task<List<SpecialityTypeModel>> GetSpecialityTypeListAsync();
    }
}
