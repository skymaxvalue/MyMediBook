using Dapper;
using System.Text.Json;
using Medicare.DAL.Persistence.Dapper;
using Medicare.Application.Models.Consultation;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.PhysicianConsultation;
using Medicare.Application.Interfaces.IPhysicianConsultation;

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

        public async Task<CreateConsultationResponseModel> CreateConsultationAsync(CreatePhysicianConsultationRequestModel model)
        {
            string procName = "USP_CreatePhysicianConsultation";
            CreateConsultationResponseModel returnData = new CreateConsultationResponseModel()
            {
                IsSuccess = 0,
                Status = 0,
                ResponseMessage = "Unable To Create Consultation"
            };
            try
            {
                var param = new DynamicParameters();
                param.Add("HospitalId", model.HospitalId);
                param.Add("CreatedBy", model.CreatedBy);
                param.Add("PatientId", model.PatientId);
                param.Add("ProfileId", model.ProfileId);
                param.Add("RequestJson", JsonSerializer.Serialize(model));

                returnData = await _context.QuerySingleStoredProcAsync<CreateConsultationResponseModel>(procName, param);
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

        public async Task<ConsultationListResponseModel> GetConsultationsByReceptionistIdAsync(GetConsultationsRequestModel model)
        {
            string procName = "USP_GetConsultationsByReceptionistId";
            var returnData = new ConsultationListResponseModel
            {
                IsSuccess = 0,
                Status = 0,
                ResponseMessage = "Unable To Fetch Consultations",
                PageNumber = model.PageNumber,
                PageSize = model.PageSize
            };
            try
            {
                var param = new DynamicParameters();
                param.Add("ReceptionistId", model.AssociateId);
                param.Add("HospitalId", model.HospitalId);
                param.Add("ConsultationStatusId", model.ConsultationStatusId);
                param.Add("FromDate", model.FromDate?.Date);
                param.Add("ToDate", model.ToDate?.Date);
                param.Add("PageNumber", model.PageNumber);
                param.Add("PageSize", model.PageSize);

                var items = await _context.QueryStoredProcListAsync<ConsultationListItemModel>(procName, param);

                returnData.Items = items;
                returnData.TotalCount = items.FirstOrDefault()?.TotalCount ?? 0;
                returnData.IsSuccess = 1;
                returnData.Status = 1;
                returnData.ResponseMessage = "Data Fetched Successfully";
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

        public async Task<ConsultationListResponseModel> GetConsultationsByAssociateIdAsync(GetConsultationsRequestModel model)
        {
            string procName = "USP_GetConsultationsByAssociateId";
            ConsultationListResponseModel returnData = new ConsultationListResponseModel
            {
                IsSuccess = 0,
                Status = 0,
                ResponseMessage = "Unable To Fetch Consultations",
                PageNumber = model.PageNumber,
                PageSize = model.PageSize
            };
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", model.AssociateId);
                param.Add("HospitalId", model.HospitalId);
                param.Add("ConsultationStatusId", model.ConsultationStatusId);
                param.Add("FromDate", model.FromDate?.Date);
                param.Add("ToDate", model.ToDate?.Date);
                param.Add("PageNumber", model.PageNumber);
                param.Add("PageSize", model.PageSize);

                var items = await _context.QueryStoredProcListAsync<ConsultationListItemModel>(procName, param);

                returnData.Items = items;
                returnData.TotalCount = items.FirstOrDefault()?.TotalCount ?? 0;
                returnData.IsSuccess = 1;
                returnData.Status = 1;
                returnData.ResponseMessage = "Data Fetched Successfully";
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

        public async Task<ConsultationDetailModel> GetConsultationByIdAsync(int consultationId, int hospitalId)
        {
            string procName = "USP_GetConsultationById";
            ConsultationDetailModel returnData = new ConsultationDetailModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("ConsultationId", consultationId);
                param.Add("HospitalId", hospitalId);

                returnData = await _context.QuerySingleStoredProcAsync<ConsultationDetailModel>(procName, param);

                if (returnData.IsSuccess == 1)
                {
                    var opt = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    if (!string.IsNullOrEmpty(returnData.AssociatedSymptomsJson))
                        returnData.AssociatedSymptoms = JsonSerializer
                            .Deserialize<List<SymptomRow>>(returnData.AssociatedSymptomsJson, opt)!
                            .Select(x => x.SymptomName).ToList();

                    if (!string.IsNullOrEmpty(returnData.MedicationsJson))
                        returnData.Medications = JsonSerializer
                            .Deserialize<List<ConsultationMedicationModel>>(returnData.MedicationsJson, opt)!;

                    returnData.AssociatedSymptomsJson = null;
                    returnData.MedicationsJson = null;
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

        private class SymptomRow { public string SymptomName { get; set; } = string.Empty; }
    }
}