using Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.IOrganization;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Organization;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class OrganisationRepository : IOrganizationRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public OrganisationRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<List<OrganisationDataModel>> GetOrganizationList()
        {
            List<OrganisationDataModel> returnData = new List<OrganisationDataModel>();
            string procName = "USP_GetOrganisationList";
            try
            {
                returnData = await _context.QueryStoredProcListAsync<OrganisationDataModel>(procName);
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
        public async Task<OrganisationDataModel> GetOrganizationByTenant(Guid tenantId)
        {
            OrganisationDataModel returnData = new OrganisationDataModel();
            string procName = "USP_GetHospitalByTenantId";
            try
            {
                var param = new DynamicParameters();
                param.Add("TenantId", tenantId);

                returnData = await _context.QuerySingleStoredProcAsync<OrganisationDataModel>(procName, param);
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
