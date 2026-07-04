using Dapper;
using Medicare.Application.Interfaces.IAuthRepository;
using Medicare.Application.Interfaces.IEmail;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.JwtToken;
using Medicare.Application.Models.Associate;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.Email;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.User;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        private readonly IEmailService _emailService;
        private readonly IJwtTokenRepository _jwtTokenRepository;
        public AuthRepository(DapperContext context, IErrorLogRepository errorLog, IEmailService emailService, IJwtTokenRepository jwtTokenRepository)
        {
            _context = context;
            _errorLog = errorLog;
            _emailService = emailService;
            _jwtTokenRepository = jwtTokenRepository;
        }

        public async Task<ResponseModel> RegisterUserAsync(UserModel model)
        {
            string procName = "USP_UserRegister";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Username", model.Username);
                param.Add("PasswordHash", model.PasswordHash);
                param.Add("PasswordSalt", model.PasswordSalt);
                param.Add("FirstName", model.FirstName);
                param.Add("LastName", model.LastName);
                param.Add("PhoneNumber", model.PhoneNumber);
                param.Add("Email", model.Email);
                param.Add("RoleId", model.RoleId);
                param.Add("DepartmentId", model.DepartmentId);
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
        public async Task<AssociateResponseModel> RegisterAssociateAsync(RegisterAssociateModel model)
        {
            string procName = "USP_RegisterAssociate";
            AssociateResponseModel returnData = new AssociateResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("TenantId", model.TenantId);
                param.Add("FirstName", model.FirstName);
                param.Add("MiddleName", model.MiddleName);
                param.Add("LastName", model.LastName);
                param.Add("PasswordHash", model.Password);
                param.Add("DateOfBirth", model.DateOfBirth);
                param.Add("Gender", model.Gender);
                param.Add("IdentityDocument", model.IdentityDocument);
                param.Add("IdentityFile", model.IdentityFileBytes);
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
                param.Add("DesignationId", model.DesignationId);

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

                returnData = await _context.QuerySingleStoredProcAsync<AssociateResponseModel>(procName, param);

                if (returnData.IsSuccess == 1 && returnData.Status == 1)
                {
                    string token = _jwtTokenRepository.GeneratePasswordResetToken(
                         returnData.UserId.ToString(),
                         returnData.EmployeeId
                     );

                    var body = $"""
                        <h2>Welcome to MediBook, {model.FirstName} {model.LastName}.</h2>
                        <p>Your account has been created.</p>
                        <p><strong>Employee ID (Username):</strong> {returnData.EmployeeId}</p>
                        <p>Click the button below to set your password. This link expires in 30 minutes.</p>
                        <a href="https://medibook.com/set-password?token={token}"
                           style="background:#0066cc; color:white; padding:12px 24px; 
                                  text-decoration:none; border-radius:4px;">
                           Set My Password
                        </a>
                        <p style="color:red;">Never share this link with anyone.</p>
                        """;

                    var emailmodel = new EmailModel
                    {
                        ToEmail = model.EmailId,
                        ToName = $"{model.FirstName} {model.LastName}",
                        Subject = "Associate Login - Rest Password Link",
                        Body = body,
                        IsHtml = true
                    };
                    bool resetPasswrodMail = await _emailService.SendEmailAsync(emailmodel);

                    if (!resetPasswrodMail)
                    {
                        returnData = new AssociateResponseModel
                        {
                            EmployeeId = string.Empty,
                            UserId = Guid.Empty,
                            IsSuccess = 0,
                            ResponseMessage = "An Error Occured While Creating Assoicate",
                            ResponseId = 0,
                            Status = 0
                        };
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
        public async Task<AuthDetailModel> GetPasswordByUsernameAsync(string Username)
        {
            string procName = "USP_GetPasswordByUsername";
            AuthDetailModel returnData = new AuthDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Username", Username);
                returnData = await _context.QuerySingleStoredProcAsync<AuthDetailModel>(procName, param);

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
        public async Task<ResponseModel> IncrementOtpAttemptsAsync(string email)
        {
            string procName = "USP_UpdatePatientOtpAttempts";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
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

        public async Task<ResponseModel> ClearOtpAsync(string email)
        {
            string procName = "USP_ClearPatientOtp";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
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

        public async Task<ResponseModel> SaveOtpAsync(OtpDetailModel model)
        {
            string procName = "USP_SavePatientOtp";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", model.Email);
                param.Add("OtpHash", model.OtpHash);
                param.Add("OtpSalt", model.OtpSalt);
                param.Add("Expiry", model.Expiry);
                param.Add("OtpAttempts", model.OtpAttempts);
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
        public async Task<OtpDetailModel> GetOtpDetailAsync(string email)
        {
            string procName = "USP_GetPatientOtpDetail";
            OtpDetailModel returnData = new OtpDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
                returnData = await _context.QuerySingleStoredProcAsync<OtpDetailModel>(procName, param);

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

        public async Task<ResponseModel> SendOtpEmailAsync(string toEmail, string toName, string otpCode)
        {
            try
            {
                var email = new EmailModel
                {
                    ToEmail = toEmail,
                    ToName = toName,
                    Subject = "Your Medicare Login OTP",
                    Body = BuildOtpEmailBody(toName, otpCode),
                    IsHtml = false
                };

                await _emailService.SendEmailAsync(email);

                return new ResponseModel()
                {
                    IsSuccess = 1,
                    ResponseMessage = "OTP email sent successfully."
                };
            }
            catch (Exception ex) 
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel()
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = "SendOtpEmailAsync",
                    Error_Trace = ex.StackTrace
                });

                return new ResponseModel()
                {
                    IsSuccess = 0,
                    ResponseMessage = "Failed to send OTP email."
                };
            }
        }
        private static string BuildOtpEmailBody(string name, string otpCode)
        {
            return $@"
Hello { name },

Your Medicare OTP is: { otpCode }

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

Thanks,
Medicare Team";
        }

        public async Task<ResponseModel> ResetFailedAttemptsAsync(string email)
        {
            string procName = "USP_ResetFailedAttempts";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("Email", email);
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
    }
}
