using Medicare.Application.Models.Appointment;
using Medicare.Application.Models.Claim;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Interfaces.IAppointment
{
    public interface IAppointmentRepository
    {
        Task<List<PatientAppointmentModel>> GetMyAppointmentListByPatientIdAsync(int patientId);
        Task<List<PatientProfileModel>> GetMyAppointmentListByAssociateIdAsync(DataRequestModel model);
        Task<List<AvailableAppointmentModel>> GetAvailableAppointmentsAsync(int associateId);
        Task<List<AppointmentDetailModel>> GetFrontOfficeAppointmentsList(DataRequestFilterModel model);
        Task<AppointmentDetailModelDto> GetAppointmentById(int appointmentId);
        Task<ResponseModel> CreateAppointmentAsync(AppointmentMasterModel model);
        Task<ResponseModel> UpdateAppointmentScheduleAsync(UpdateAppointmentScheduleRequestModel model);
        Task<ResponseModel> CancelAppointmentByIdAsync(CancelAppointmentScheduleRequestModel model);
        Task<ResponseModel> ConfirmAppointmentStatusAsync(int appointmentId);
        Task<ClaimAuditResponse> GetClaimAuditAsync(int claimId);
        Task<ResponseModel> UpdateConsultationStatusAsync(UpdateConsultationStatusRequestModel model);
        Task<CollectCopayResponse> CollectCopayAsync(CollectCopayRequest model);
    }
}
