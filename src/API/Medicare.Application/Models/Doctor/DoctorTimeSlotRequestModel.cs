namespace Medicare.Application.Models.Doctor
{
    public class DoctorTimeSlotRequestModel
    {
        public int AssociateId { get; set; }
        public DateOnly? FromDate{ get; set; }
        public DateOnly? ToDate { get; set; }
    }
}
