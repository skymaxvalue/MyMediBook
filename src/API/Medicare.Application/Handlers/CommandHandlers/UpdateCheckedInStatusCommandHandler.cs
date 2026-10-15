using MediatR;
using Medicare.Application.Features.Commands.Appointment;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class UpdateCheckedInStatusCommandHandler : IRequestHandler<UpdateCheckedInStatusCommand, AppointmentDetailModel>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public UpdateCheckedInStatusCommandHandler(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }
        public async Task<AppointmentDetailModel> Handle(UpdateCheckedInStatusCommand request, CancellationToken cancellationToken)
        {
            var result = await _appointmentRepository.UpdateAppointmentCheckedInStatusAsync(request.model);
            return new AppointmentDetailModel
            {
                AppointmentId = result.AppointmentId,
                PatientId = result.PatientId,
                ProfileId = result.ProfileId,
                SlotId = result.SlotId,
                PatientName = result.PatientName,
                DateOfBirth = result.DateOfBirth,
                Gender = result.Gender,
                SlotDate = result.SlotDate,
                SlotDay = result.SlotDay,
                SlotStartTime = result.SlotStartTime,
                SlotEndTime = result.SlotEndTime,
                AppointmentStatus = result.AppointmentStatus,
                VisitPurpose = result.VisitPurpose,
                VisitType = result.VisitType,
                OtpMethod = result.OtpMethod,
                CreatedDate = result.CreatedDate,
                Insurance = result.Insurance,
                CheckedInAt = result.CheckedInAt,
                IsCheckedIn = result.IsCheckedIn,
                DoctorProfile = new DoctorProfileModel
                {
                    AssociateId = result.AssociateId,
                    Name = result.Name,
                    Degree = result.Degree,
                    Image = result.Image,
                    Department = result.Department,
                    DesignationName = result.DesignationName,
                    FromTime = result.FromTime,
                    ToTime = result.ToTime
                },
                IsSuccess = result.IsSuccess,
                Status = result.Status,
                ResponseMessage = result.ResponseMessage
            };
        }
    }
}
