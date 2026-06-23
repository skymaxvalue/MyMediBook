using Medicare.Application.Interfaces.IErrorHandling;

namespace Medicare.Application.Models.Orders
{
    public class RxOrderDetailModel : IErrorHandling
    {
        public int OrderId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int AssociateId { get; set; }
        public string DoctorName { get; set; }
        public int? PharmacyId { get; set; }
        public string? PharmacyName { get; set; }
        public string RxName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }   // "Twice daily", "Once daily"
        public int DurationDays { get; set; }
        public string Instructions { get; set; }
        public string OrderStatus { get; set; }
        public string? CancelReason { get; set; }
        public DateTime OrderDate { get; set; }
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
    }
}
