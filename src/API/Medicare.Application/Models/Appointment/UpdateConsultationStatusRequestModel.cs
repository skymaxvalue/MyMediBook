namespace Medicare.Application.Models.Appointment
{
    public class UpdateConsultationStatusRequestModel
    {
        public int AppointmentId { get; set; }
        public int AssociateId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public int ConsultationStatusId { get; set; }
    }
}
