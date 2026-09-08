using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Billing
{
    //  Consultation Charges
    public class AddConsultationRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
        public int Units { get; set; }
        public decimal ChargeAmount { get; set; }
    }

    //  Lab Test Charges
    public class AddLabTestRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string LabTestCode { get; set; } = string.Empty;
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
        public int Units { get; set; }
        public decimal ChargeAmount { get; set; }
        public string? TestName { get; set; }
        public string? LabName { get; set; }
    }

    //  Scan/Imaging Charges
    public class AddScanRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }

        /// <summary>X-Ray | MRI | CT | Ultrasound</summary>
        public string ScanType { get; set; } = string.Empty;
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
        public int Units { get; set; }
        public decimal ChargeAmount { get; set; }
        public string? BodyPart { get; set; }
        public string? Findings { get; set; }
    }

    //  ICU Charges
    public class AddICURequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string ICUType { get; set; } = string.Empty;
        public decimal Hours { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal ChargeAmount { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
    }

    //  Bed/Room Charges
    public class AddBedChargeRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }

        /// <summary>General | Private | Semi-Private | ICU</summary>
        public string RoomType { get; set; } = string.Empty;
        public int Days { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public decimal ChargeAmount { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
    }

    //  Surgery Charges
    public class AddSurgeryRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string SurgeryType { get; set; } = string.Empty;
        public int SurgeonId { get; set; }
        public int DurationMinutes { get; set; }
        public decimal ChargeAmount { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
    }

    //   Pharmacy Charges
    public class AddPharmacyRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string MedicineName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Dosage { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public decimal ChargeAmount { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
    }

    // Nursing Charges
    public class AddNursingRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public decimal Hours { get; set; }
        public int NurseId { get; set; }
        public decimal ChargeAmount { get; set; }
        public string CPTCode { get; set; } = string.Empty;
        public string ICDCode { get; set; } = string.Empty;
    }

    // Consumables
    public class AddConsumableRequest
    {
        public int ClaimId { get; set; }
        public int AppointmentId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ChargeAmount { get; set; }
    }

     // Line Item Response
    public class LineItemResponse : IErrorHandling
    {
        public int LineItemId { get; set; }
        public int ClaimId { get; set; }
        public string ServiceCategory { get; set; } = string.Empty;
        public decimal ChargeAmount { get; set; }
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } 
    }
}
