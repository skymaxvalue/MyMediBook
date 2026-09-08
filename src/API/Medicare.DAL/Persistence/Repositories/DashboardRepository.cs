using Dapper;
using Medicare.Application.Interfaces.IDashboard;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.Dashboard;
using Medicare.DAL.Persistence.Dapper;

namespace Medicare.DAL.Persistence.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public DashboardRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<DashboardSummaryModel> GetDashboardSummaryAsync(DataRequestModel model)
        {
            string procName = "USP_GetDashboardSummaryCount";
            DashboardSummaryModel returnData = new DashboardSummaryModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", model.AssociateId);
                param.Add("FromDate", model.FromDate?.Date);
                param.Add("ToDate", model.ToDate?.Date);

                returnData = await _context.QuerySingleStoredProcAsync<DashboardSummaryModel>(procName, param);
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
        public async Task<List<RecentPatientDataModel>> GetRecentPatientDetailAsync(DataRequestModel model)
        {
            string procName = "USP_GetRecentPatientDetail";
            List<RecentPatientDataModel> returnData = new List<RecentPatientDataModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", model.AssociateId);
                param.Add("FromDate", model.FromDate?.Date);
                param.Add("ToDate", model.ToDate?.Date);

                returnData = await _context.QueryStoredProcListAsync<RecentPatientDataModel>(procName, param);
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
        public async Task<List<PatientQueueDataModel>> GetTodaysPatientQueueAsync(DataRequestModel model)
        {
            string procName = "USP_GetTodaysPatientQueueDetail";
            List<PatientQueueDataModel> returnData = new List<PatientQueueDataModel>();
            try
            {
                var param = new DynamicParameters();
                param.Add("AssociateId", model.AssociateId);
                param.Add("FromDate", model.FromDate?.Date);
                param.Add("ToDate", model.ToDate?.Date);

                returnData = await _context.QueryStoredProcListAsync<PatientQueueDataModel>(procName, param);
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
