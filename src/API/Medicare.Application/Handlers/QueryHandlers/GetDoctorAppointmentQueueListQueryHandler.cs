using MediatR;
using Medicare.Application.Features.Queries.Appointments;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetDoctorAppointmentQueueListQueryHandler : IRequestHandler<GetDoctorAppointmentQueueListQuery, List<AppointmentDetailModel>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public GetDoctorAppointmentQueueListQueryHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<List<AppointmentDetailModel>> Handle(GetDoctorAppointmentQueueListQuery request, CancellationToken cancellationToken)
        {
            var result = await _appointmentRepository.GetDoctorAppointmentQueueList(request.model);
            return result.Select(item => new AppointmentDetailModel
            {
                AppointmentId = item.AppointmentId,
                PatientId = item.PatientId,
                ProfileId = item.ProfileId,
                SlotId = item.SlotId,
                PatientName = item.PatientName,
                DateOfBirth = item.DateOfBirth,
                Gender = item.Gender,
                SlotDate = item.SlotDate,
                SlotDay = item.SlotDay,
                SlotStartTime = item.SlotStartTime,
                SlotEndTime = item.SlotEndTime,
                AppointmentStatus = item.AppointmentStatus,
                VisitPurpose = item.VisitPurpose,
                VisitType = item.VisitType,
                OtpMethod = item.OtpMethod,
                CreatedDate = item.CreatedDate,
                Insurance = item.Insurance,
                PhoneNumber = item.PhoneNumber,
                PatientEmail = item.PatientEmail,
                CheckedInAt = item.CheckedInAt,
                IsCheckedIn = item.IsCheckedIn,
                ConsultationStatusId = item.ConsultationStatusId,
                DoctorProfile = new DoctorProfileModel
                {
                    AssociateId = item.AssociateId,
                    Name = item.Name,
                    Degree = item.Degree,
                    Image = item.Image,
                    Department = item.Department,
                    DesignationName = item.DesignationName,
                    FromTime = item.FromTime,
                    ToTime = item.ToTime
                },
                IsSuccess = item.IsSuccess,
                Status = item.Status,
                ResponseMessage = item.ResponseMessage
            }).ToList();
        }
    }   
}
