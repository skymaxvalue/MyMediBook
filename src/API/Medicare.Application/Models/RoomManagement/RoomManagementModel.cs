using System.Text.Json.Serialization;

namespace Medicare.Application.Models.RoomManagement
{

    public class AddEditBedModel
    {
        public int? BedId { get; set; }
        public string? BedNumber { get; set; }  
        public int? ClinicalCategory { get; set; }
        public int? MechanicalType { get; set; }
        public int? MattressType { get; set; }
        public bool? HasEKGMonitor { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class AddEditRoomBedsRequest
    {
        public int RoomId { get; set; }
        public int WardId { get; set; }
        public int? DepartmentId { get; set; }
        public int RoomTypeId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public short? Floor { get; set; }
        public int BedCount { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public int GenderRestriction { get; set; }
        public int RoomCategory { get; set; } = 3;
        public bool IsIsolationCapable { get; set; }
        public bool IsNegativePressure { get; set; }
        public bool IsICUCapable { get; set; }
        public bool IsCCUCapable { get; set; }
        public bool IsVentilatorCapable { get; set; }
        public bool HasAICamera { get; set; }
        public bool HasOxygenSystem { get; set; }
        public bool IsACControllable { get; set; }
        public bool HasAttachedRestroom { get; set; }
        public bool IsOpenTraceCapable { get; set; }
        public List<int>? AmenityIds { get; set; }
        public List<RoomEquipmentItemModel>? Equipment { get; set; }
        public List<AddEditBedModel>? Beds { get; set; }
        [JsonIgnore] 
        public int HospitalId { get; set; }
        [JsonIgnore] 
        public int CreatedBy { get; set; }
    }

    public class RoomEquipmentItemModel
    {
        public int? EquipmentType { get; set; }
        public string EquipmentName { get; set; } = string.Empty;
        public int? Quantity { get; set; } = 1;
        public bool? IsOperational { get; set; } = true;
    }

}
