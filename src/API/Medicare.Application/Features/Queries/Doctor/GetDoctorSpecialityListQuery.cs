using MediatR;
using Medicare.Application.Models.Speciality;

namespace Medicare.Application.Features.Queries.Doctor
{
    public record GetDoctorSpecialityListQuery(
        string? DoctorName,
        string? DepartmentName,
        int hospitalId
    ) : IRequest<List<DoctorSpecialityDataModel>>;
}
