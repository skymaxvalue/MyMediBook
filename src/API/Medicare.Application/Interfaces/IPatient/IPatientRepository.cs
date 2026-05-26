
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Interfaces.IPatient
{
    public interface IPatientRepository
    {
        Task<ResponseModel> CreatePatientDetails(PatientMasterModel model);
        Task<ResponseModel> UpdatePatientDetails(PatientMasterModel model);
        Task<PatientMasterModel> GetPatientByContact(string contactNo);
        Task<PatientMasterModel> GetPatientById(int Id);
    }
}
