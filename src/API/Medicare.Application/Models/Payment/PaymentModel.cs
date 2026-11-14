using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Payments
{
    public class GetPaymentRecordsRequestModel
    {
        public int PatientId { get; set; }
        [JsonIgnore]
        public int HospitalId { get; set; }   // set from JWT, never from the client
        public string? Status { get; set; }   // optional filter
    }

    public class PaymentRecordModel
    {
        public int PaymentRecordId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public int? DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? FeeType { get; set; }
        public decimal Fee { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal BalanceDue { get; set; }
        public string Status { get; set; } = string.Empty;

        public bool IsPayable => Status != "Paid" && BalanceDue > 0;
    }
}