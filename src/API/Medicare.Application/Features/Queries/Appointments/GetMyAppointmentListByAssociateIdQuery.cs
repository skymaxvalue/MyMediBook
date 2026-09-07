using MediatR;
using Medicare.Application.Models.CommonModels.Request;
using Medicare.Application.Models.Patient;

namespace Medicare.Application.Features.Queries.Appointments
{
    public record GetMyAppointmentListByAssociateIdQuery(DataRequestModel model) : IRequest<List<PatientProfileModel>>;
}
