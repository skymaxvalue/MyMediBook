using MediatR;
using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Features.Queries.Doctor
{
    public record GetDoctorListByHospitalIdQuery(int activeHospitalId) : IRequest<List<DoctorCategoryModel>>;
}
