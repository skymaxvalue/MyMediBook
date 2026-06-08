namespace Medicare.Application.Models.Appointment
{
    public class AppointmentMasterModel
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int SlotId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; }
        public string VisitPurpose { get; set; }
        public string VisitType { get; set; }
        public string OtpMethod { get; set; }
        public InsuranceData InsuranceData { get; set; }
        public PaymentData PaymentData { get; set; }
       public bool Insurance {  get; set; }
    }

    public class InsuranceData
    {
        public string Provider { get; set; }
        public string Policy { get; set; }
        public int GroupId { get; set; }
        public string HolderName { get; set; }
        public string Address { get; set; }
    }

    public class PaymentData
    {
        public string PaymentType { get; set; }
        public string TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}