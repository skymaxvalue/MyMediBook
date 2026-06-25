using Medicare.Application.Interfaces.IErrorHandling;
using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Models.Appointment
{
    public class AppointmentDetailModel : IErrorHandling    
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public int SlotId { get; set; }
        public string PatientName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string RelationType { get; set; }
        public string SlotDate { get; set; }
        public string SlotDay { get; set; }
        public string SlotStartTime { get; set; }
        public string SlotEndTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string VisitPurpose { get; set; }
        public string VisitType { get; set; }
        public string OtpMethod { get; set; }
        public string CreatedDate{ get; set; }
        public DoctorProfileModel DoctorProfile { get; set; }
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
    }
    public class AppointmentDetailModelDto : IErrorHandling
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public int SlotId { get; set; }
        public string PatientName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string RelationTypeName { get; set; }
        public string SlotDate { get; set; }
        public string SlotDay { get; set; }
        public string SlotStartTime { get; set; }
        public string SlotEndTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string VisitPurpose { get; set; }
        public string VisitType { get; set; }
        public string OtpMethod { get; set; }
        public string CreatedDate { get; set; }
        public int AssociateId { get; set; }
        public string Name { get; set; }
        public string Degree { get; set; }
        public string Image { get; set; }
        public string Department { get; set; }
        public string DesignationName { get; set; }
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public int IsSuccess { get; set; }
        public int Status { get; set; }
        public string ResponseMessage { get; set; }
    }
}
