using MediatR;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Features.Queries.Appointments
{
    public record ConfirmAppointmentStatusQuery(string token) : IRequest<ResponseModel>;
}       