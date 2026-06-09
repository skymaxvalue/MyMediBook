
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Interfaces.IPatient
{
    public interface IPatientRepository
    {
        Task<ResponseModel> CreatePatientDetails(PatientMasterModel model);
        Task<ResponseModel> UpdatePatientDetails(UpdatePatientRequestModel model);
        Task<PatientMasterModel> GetPatientByContact(string contactNo);
        Task<PatientMasterModel> GetPatientById(int Id);
        Task<PatientAuthDetailModel> GetPasswordByUsernameAsync(string Username);
        Task<PatientDetailModel> GetPatientInfoByUsername(string Username);
    }
}
