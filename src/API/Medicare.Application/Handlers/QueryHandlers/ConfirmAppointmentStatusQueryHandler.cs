using MediatR;
using Medicare.Application.Interfaces.IAppointment;
using Medicare.Application.Interfaces.JwtToken;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class ConfirmAppointmentStatusQueryHandler : IRequestHandler<Features.Queries.Appointments.ConfirmAppointmentStatusQuery, ResponseModel>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IJwtTokenRepository _tokenRepository;
        public ConfirmAppointmentStatusQueryHandler(IAppointmentRepository appointmentRepository, IJwtTokenRepository tokenRepository)
        {
            _appointmentRepository = appointmentRepository;
            _tokenRepository = tokenRepository;
        }
        public async Task<ResponseModel> Handle(Features.Queries.Appointments.ConfirmAppointmentStatusQuery request, CancellationToken cancellationToken)
        {
            var appointmentId = _tokenRepository.ValidateAppointmentConfirmationToken(request.token);

            if(appointmentId == null)
            {
                return new ResponseModel
                {
                    Status = 0,
                    IsSuccess = 0,
                    ResponseId = 0,
                    ResponseMessage = "Invalid or Expired Confirmation Link."
                };
            }

            return await _appointmentRepository.ConfirmAppointmentStatusAsync(appointmentId.Value);
        }
    }
}
