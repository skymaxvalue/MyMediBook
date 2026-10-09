using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Medicare.Application.Models.RoomManagement
{
    public class RoomSummaryModel
    {
        public int RoomId { get; set; }
        public int HospitalId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public short? Floor { get; set; }
        public int BedCount { get; set; }
        public bool IsActive { get; set; }
        public int GenderRestriction { get; set; }
        public int RoomCategory { get; set; }
        public int? DepartmentId { get; set; }
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
        public int WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;
        public int BedCapacity { get; set; }
        public decimal DailyRate { get; set; }
        public int TotalBeds { get; set; }
        public int AvailableBeds { get; set; }
        public int OccupiedBeds { get; set; }
        public int ReservedBeds { get; set; }
        public int MaintenanceBeds { get; set; }
        public int CleaningBeds { get; set; }
        public int OutOfServiceBeds { get; set; }
    }

    public class BedDetailModel
    {
        public int BedId { get; set; }
        public int RoomId { get; set; }
        public string BedLabel { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        /// <summary>1 ICU | 2 MedSurg | 3 Pediatric | 4 Bariatric | 5 L&D</summary>
        public int ClinicalCategory { get; set; }

        /// <summary>1 Electric | 2 Manual</summary>
        public int MechanicalType { get; set; }

        /// <summary>1 Standard | 2 Special | 3 Air</summary>
        public int MattressType { get; set; }
        public bool HasEKGMonitor { get; set; }

        /// <summary>0 OK | 1 Needs Maintenance | 2 Under Maintenance</summary>
        public int MaintenanceStatus { get; set; }

        /// <summary>0 Clean | 1 Needs Cleaning | 2 Being Cleaned</summary>
        public int CleaningStatus { get; set; }
        public bool IsActive { get; set; }
        public long? ReservedForAdmissionId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string WardName { get; set; } = string.Empty;
        public string RoomTypeName { get; set; } = string.Empty;
    }

    public class RoomAmenityModel
    {
        public int RoomId { get; set; }
        public int FacilityId { get; set; }
        public string FacilityName { get; set; } = string.Empty;
        public decimal DailyCharge { get; set; }
    }

    public class RoomEquipmentDetailModel
    {
        public int RoomId { get; set; }
        public int EquipmentId { get; set; }
        public int EquipmentType { get; set; }
        public string EquipmentName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public bool IsOperational { get; set; }
    }
    public class HospitalRoomBedsModel
    {
        public List<RoomSummaryModel> Rooms { get; set; } = new();
        public List<BedDetailModel> Beds { get; set; } = new();
        public List<RoomAmenityModel> Amenities { get; set; } = new();
        public List<RoomEquipmentDetailModel> Equipment { get; set; } = new();
    }


    public class AvailableRoomModel
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public short? Floor { get; set; }
        public int BedCount { get; set; }
        public int GenderRestriction { get; set; }
        public int RoomCategory { get; set; }
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
        public int WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;
        public int BedCapacity { get; set; }
        public decimal DailyRate { get; set; }
        public int TotalBeds { get; set; }
        public int AvailableBeds { get; set; }
    }

    public class HospitalRoomAvailableBedsModel
    {
        public List<AvailableRoomModel> Rooms { get; set; } = new();
        public List<BedDetailModel> Beds { get; set; } = new();
        public List<RoomAmenityModel> Amenities { get; set; } = new();
    }

    // ── Query filter models ───────────────────────────────────────────────────────

    public class GetRoomBedsFilterModel
    {
        public int? WardId { get; set; }
        public int? RoomTypeId { get; set; }

        [JsonIgnore] public int HospitalId { get; set; }
    }

    public class GetAvailableRoomsFilterModel
    {
        public int? WardId { get; set; }
        public int? RoomTypeId { get; set; }
        public int? GenderRestriction { get; set; }
        public int? RoomCategory { get; set; }
        public bool? IsICUCapable { get; set; }
        public bool? IsIsolationCapable { get; set; }

        [JsonIgnore] public int HospitalId { get; set; }
    }

}
