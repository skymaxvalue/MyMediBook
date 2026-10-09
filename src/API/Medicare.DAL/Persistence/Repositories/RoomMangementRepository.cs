using Dapper;
using System.Text.Json;
using Medicare.DAL.Persistence.Dapper;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Models.RoomManagement;
using Medicare.Application.Interfaces.IRoomMangement;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.DAL.Persistence.Repositories
{
    public class RoomMangementRepository : IRoomMangementRepository
    {
        private readonly IDapperContext _context;
        private readonly IErrorLogRepository _errorLog;
        public RoomMangementRepository(IDapperContext context, IErrorLogRepository errorLog)
        {
            _context = context;
            _errorLog = errorLog;
        }
        public async Task<ResponseModel> AddEditRoomBedsAsync(AddEditRoomBedsRequest model)
        {
            string procName = "USP_AddEditRoomBeds";
            ResponseModel returnData = new ResponseModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("HospitalId", model.HospitalId);
                param.Add("RoomId", model.RoomId);
                param.Add("WardId", model.WardId);
                param.Add("DepartmentId", model.DepartmentId);
                param.Add("RoomTypeId", model.RoomTypeId);
                param.Add("RoomNumber", model.RoomNumber);
                param.Add("Floor", model.Floor);
                param.Add("BedCount", model.BedCount);
                param.Add("IsActive", model.IsActive);
                param.Add("CreatedBy", model.CreatedBy);
                param.Add("GenderRestriction", model.GenderRestriction);
                param.Add("RoomCategory", model.RoomCategory);
                param.Add("IsIsolationCapable", model.IsIsolationCapable);
                param.Add("IsNegativePressure", model.IsNegativePressure);
                param.Add("IsICUCapable", model.IsICUCapable);
                param.Add("IsCCUCapable", model.IsCCUCapable);
                param.Add("IsVentilatorCapable", model.IsVentilatorCapable);
                param.Add("HasAICamera", model.HasAICamera);
                param.Add("HasOxygenSystem", model.HasOxygenSystem);
                param.Add("IsACControllable", model.IsACControllable);
                param.Add("HasAttachedRestroom", model.HasAttachedRestroom);
                param.Add("IsOpenTraceCapable", model.IsOpenTraceCapable);

                param.Add("AmenityIdsJson",
                    model.AmenityIds != null
                        ? JsonSerializer.Serialize(model.AmenityIds)
                        : null);

                param.Add("EquipmentJson",
                    model.Equipment != null
                        ? JsonSerializer.Serialize(model.Equipment)
                        : null);

                param.Add("BedsJson",
                    model.Beds != null
                        ? JsonSerializer.Serialize(model.Beds)
                        : null);

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

        public async Task<HospitalRoomBedsModel> GetHospitalRoomBedsAsync(GetRoomBedsFilterModel model)
        {
            string procName = "USP_GetHospitalRoomBeds";
            HospitalRoomBedsModel returnData = new HospitalRoomBedsModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("HospitalId", model.HospitalId);
                param.Add("WardId", model.WardId);
                param.Add("RoomTypeId", model.RoomTypeId);

                returnData = await _context.QueryMultipleAsync(procName, param, async grid => new HospitalRoomBedsModel
                {
                    Rooms = (await grid.ReadAsync<RoomSummaryModel>()).ToList(),
                    Beds = (await grid.ReadAsync<BedDetailModel>()).ToList(),
                    Amenities = (await grid.ReadAsync<RoomAmenityModel>()).ToList(),
                    Equipment = (await grid.ReadAsync<RoomEquipmentDetailModel>()).ToList()
                });
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

        public async Task<HospitalRoomAvailableBedsModel> GetHospitalRoomAvailableBedsAsync(GetAvailableRoomsFilterModel model)
        {
            string procName = "USP_GetHospitalRoomAvailableBeds";
            HospitalRoomAvailableBedsModel returnData = new HospitalRoomAvailableBedsModel();
            try
            {
                var param = new DynamicParameters();
                param.Add("HospitalId", model.HospitalId);
                param.Add("WardId", model.WardId);
                param.Add("RoomTypeId", model.RoomTypeId);
                param.Add("GenderRestriction", model.GenderRestriction);
                param.Add("RoomCategory", model.RoomCategory);
                param.Add("IsICUCapable", model.IsICUCapable);
                param.Add("IsIsolationCapable", model.IsIsolationCapable);

                await _context.QueryMultipleAsync(procName, param, async grid => new HospitalRoomAvailableBedsModel
                {
                    Rooms = (await grid.ReadAsync<AvailableRoomModel>()).ToList(),
                    Beds = (await grid.ReadAsync<BedDetailModel>()).ToList(),
                    Amenities = (await grid.ReadAsync<RoomAmenityModel>()).ToList()
                });
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
