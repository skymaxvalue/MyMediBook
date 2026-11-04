using Dapper;
using Medicare.DAL.Persistence.Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.IConsultation;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.Consultation.Medicare.Application.Models.Consultation;
using Medicare.Application.Models.Consultation;

namespace Medicare.DAL.Persistence.Repositories
{
    public class ConsultationRepository : IConsultationRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public ConsultationRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<ConsultationResponseModel> CreateConsultationAsync(ConsultationMasterModel model)
        {
            string procName = "USP_CreateConsultation";
            ConsultationResponseModel response = new ConsultationResponseModel();
            try
            {
                var param = new DynamicParameters();

                param.Add("PatientId", model.PatientId);
                param.Add("ProfileId", model.ProfileId);
                param.Add("AppointmentId", model.AppointmentId);
                param.Add("AssociateId", model.AssociateId);
                param.Add("HospitalId", model.HospitalId);

                param.Add("SpecialityId", model.SpecialityId);
                param.Add("VisitPurposeId", model.VisitPurposeId);
                param.Add("VisitTypeId", model.VisitTypeId);

                param.Add("ConsultationMode", model.ConsultationMode);
                param.Add("PreferredDate", model.PreferredDate);
                param.Add("PreferredTime", model.PreferredTime);
                param.Add("ProviderPreference", model.ProviderPreference);

                param.Add("ChiefComplaint", model.ChiefComplaint);
                param.Add("SymptomDuration", model.SymptomDuration);
                param.Add("PainLevel", model.PainLevel);
                param.Add("UrgencyLevel", model.UrgencyLevel);

                param.Add("CreatedBy", model.CreatedBy);

                response = await _context.QuerySingleStoredProcAsync<ConsultationResponseModel>(procName,param);
            }
            catch (Exception ex)
            {
                await _errorLog.InsertErrorLog(new ErrorLogModel
                {
                    IsDBError = false,
                    Error_Message = ex.Message,
                    Error_Procedure = procName,
                    Error_Trace = ex.StackTrace
                });
            }

            return response;
        }

    }
}
