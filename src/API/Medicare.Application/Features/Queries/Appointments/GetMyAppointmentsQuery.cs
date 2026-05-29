using MediatR;
using Medicare.Application.Models.Appointment;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Features.Queries.Appointments
{
    public record GetMyAppointmentsQuery(int PatientId)
       : IRequest<List<PatientAppointmentModel>>;
}
