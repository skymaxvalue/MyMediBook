using Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using Medicare.DAL.Persistence.Dapper;
namespace Medicare.DAL.Persistence.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public PatientRepository(DapperContext context, IErrorLogRepository errorLog) 
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<ResponseModel> CreatePatientDetails(PatientMasterModel model)
        {
            string procName = "USP_CreatePatientDetails";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", model.PatientId);
                param.Add("FirstName", model.FirstName);
                param.Add("MiddleName", model.MiddleName);
                param.Add("LastName", model.LastName);
                param.Add("DateOfBirth", model.DateOfBirth);
                param.Add("PhoneNumber", model.PhoneNumber);
                param.Add("Email", model.Email);
                param.Add("Gender", model.Gender);
                param.Add("AddressLine1", model.AddressLine1);
                param.Add("AddressLine2", model.AddressLine2);
                param.Add("CityId", model.CityId);
                param.Add("ZipCode", model.ZipCode);
                param.Add("StateId", model.StateId);
                param.Add("CountryId", model.CountryId);
                param.Add("Username", model.Username);
                param.Add("PasswordHash", model.PasswordHash);
                param.Add("PasswordSalt", model.PasswordSalt);
                param.Add("SecurityQuestionId", model.SecurityQuestionId);
                param.Add("SecurityAnswerHash", model.SecurityAnswerHash);
                param.Add("SecurityAnswerSalt", model.SecurityAnswerSalt);
                param.Add("IsActive", model.IsActive);
                param.Add("CreatedBy", model.CreatedBy);
                param.Add("CreatedDate", model.CreatedDate);
                param.Add("UpdatedBy", model.UpdatedBy);
                param.Add("UpdatedDate", model.UpdatedDate);
                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }

            return returnData;
        }

        public async Task<ResponseModel> UpdatePatientDetails(PatientMasterModel model)
        {
            string procName = "USP_UpdatePatientDetails";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("PatientId", model.PatientId);
                param.Add("FirstName", model.FirstName);
                param.Add("MiddleName", model.MiddleName);
                param.Add("LastName", model.LastName);
                param.Add("DateOfBirth", model.DateOfBirth);
                param.Add("PhoneNumber", model.PhoneNumber);
                param.Add("Email", model.Email);
                param.Add("Gender", model.Gender);
                param.Add("AddressLine1", model.AddressLine1);
                param.Add("AddressLine2", model.AddressLine2);
                param.Add("CityId", model.CityId);
                param.Add("ZipCode", model.ZipCode);
                param.Add("StateId", model.StateId);
                param.Add("CountryId", model.CountryId);
                param.Add("Username", model.Username);
                param.Add("PasswordHash", model.PasswordHash);
                param.Add("PasswordSalt", model.PasswordSalt);
                param.Add("SecurityQuestionId", model.SecurityQuestionId);
                param.Add("SecurityAnswerHash", model.SecurityAnswerHash);
                param.Add("SecurityAnswerSalt", model.SecurityAnswerSalt);
                param.Add("IsActive", model.IsActive);
                param.Add("CreatedBy", model.CreatedBy);
                param.Add("CreatedDate", model.CreatedDate);
                param.Add("UpdatedBy", model.UpdatedBy);
                param.Add("UpdatedDate", model.UpdatedDate);
                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }

            return returnData;
        }

        public async Task<PatientMasterModel> GetPatientByContact(string contactNo)
        {
            string procName = "USP_GetPatientByContactNo";
            PatientMasterModel returnData = new PatientMasterModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("PhoneNumber", contactNo);
                returnData = await _context.QuerySingleStoredProcAsync<PatientMasterModel>(procName, param);

            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }

            return returnData;
        }

        public async Task<PatientMasterModel> GetPatientById(int Id)
        {
            string procName = "USP_GetPatientById";
            PatientMasterModel returnData = new PatientMasterModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Id", Id);
                returnData = await _context.QuerySingleStoredProcAsync<PatientMasterModel>(procName, param);

            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }

            return returnData;
        }
    }
}
