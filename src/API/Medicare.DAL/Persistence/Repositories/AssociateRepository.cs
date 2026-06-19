using Dapper;
using Medicare.Application.Interfaces.IAssociate;
using Medicare.Application.Interfaces.IDoctor;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class AssociateRepository : IAssociateRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        private readonly IDoctorRepository _doctorRepository;
        public AssociateRepository(DapperContext context, IErrorLogRepository errorLogRepository, IDoctorRepository doctorRepository)
        {
            _context = context;
            _errorLog = errorLogRepository;
            _doctorRepository = doctorRepository;
        }
        public async Task<AssociateDetailModel> GetAssociateDetailByIdAsync(int associateId)
        {
            string procName = "USP_GetAssociateDetailById";
            AssociateDetailModel returnData = new AssociateDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", associateId);

                returnData = await _context.QuerySingleStoredProcAsync<AssociateDetailModel>(procName, param);
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

        public async Task<ResponseModel> RegisterAssociateAsync(RegisterAssociateModel model)
        {
            string procName = "USP_RegisterAssociate";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("FirstName", model.FirstName);
                param.Add("MiddleName", model.MiddleName);
                param.Add("LastName", model.LastName);
                param.Add("DateOfBirth", model.DateOfBirth);
                param.Add("Gender", model.Gender);
                param.Add("IdentityDocument", model.IdentityDocument);
                param.Add("IdentityFile", model.IdentityFileBytes);
                param.Add("EmployeeId", model.EmployeeId);
                param.Add("PhoneCountryCode", model.PhoneCountryCode);
                param.Add("PhoneNumber", model.PhoneNumber);
                param.Add("EmailId", model.EmailId);
                param.Add("ResidentialAddress", model.ResidentialAddress);
                param.Add("PermanentAddress", model.PermanentAddress);
                param.Add("CityId", model.CityId);
                param.Add("StateId", model.StateId);
                param.Add("CountryId", model.CountryId);
                param.Add("ZipCode", model.ZipCode);
                param.Add("LanguagesSpoken", model.LanguagesSpoken);
                param.Add("EmergencyName", model.EmergencyName);
                param.Add("EmergencyRelationship", model.EmergencyRelationship);
                param.Add("EmergencyPhone", model.EmergencyPhone);
                param.Add("EmergencyCode", model.EmergencyCode);
                param.Add("JoiningDate", model.JoiningDate);
                param.Add("EmployeeType", model.EmployeeType);
                param.Add("DepartmentId", model.DepartmentId);
                param.Add("RoleId", model.RoleId);
                param.Add("SpecialityId", model.SpecialityId);

                param.Add("HighestDegree", model.AssociateQualification.HighestDegree);
                param.Add("Specialization", model.AssociateQualification.Specialization);
                param.Add("InstitutionName", model.AssociateQualification.InstitutionName);
                param.Add("YearOfPassing", model.AssociateQualification.YearOfPassing);
                param.Add("RegistrationNumber", model.AssociateQualification.RegistrationNumber);
                param.Add("LicenseExpiry", model.AssociateQualification.LicenseExpiry);
                param.Add("AdditionalCertifications", model.AssociateQualification.AdditionalCertifications);
                param.Add("QualificationDocuments", model.AssociateQualification.QualificationDocumentBytes);

                param.Add("ExperienceYears", model.AssociateExperience.ExperienceYears);
                param.Add("OrganizationName", model.AssociateExperience.OrganizationName);
                param.Add("DesignationRole", model.AssociateExperience.DesignationRole);
                param.Add("DepartmentWorked", model.AssociateExperience.DepartmentWorked);
                param.Add("KeySkills", model.AssociateExperience.KeySkills);
                
                param.Add("CreatedBy", model.CreatedBy);

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

        public async Task<ResponseModel> CreateAssociateScheduleAsync(AssociateScheduleModel model)
        {
            string procName = "USP_SaveAssociateSchedule";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", model.AssociateId);
                param.Add("FromDate", model.FromDate);
                param.Add("ToDate", model.ToDate);
                param.Add("FromTime", model.FromTime);
                param.Add("ToTime", model.ToTime);
                param.Add("BreakTimeFrom", model.BreakTimeFrom);
                param.Add("BreakTimeTo", model.BreakTimeTo);
                param.Add("WorkingDays", model.WorkingDays);
                param.Add("ConsultationTime", model.ConsultationTime);
                param.Add("AverageCharge", model.AverageCharge);
                param.Add("OtpMethod", model.OtpMethod);
                param.Add("CreatedBy", model.CreatedBy);

                returnData = await _context.QuerySingleStoredProcAsync<ResponseModel>(procName, param);
                
                if (returnData.IsSuccess == 1 && returnData.ResponseId > 0)
                {
                    var slotResult = await _doctorRepository.CreateDoctorTimeSlotsAsync(model);

                    if (slotResult.IsSuccess != 1)
                    {
                        returnData.IsSuccess = 0;
                        returnData.ResponseMessage = "Slot generation failed: " + slotResult.ResponseMessage;
                    }
                }
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
