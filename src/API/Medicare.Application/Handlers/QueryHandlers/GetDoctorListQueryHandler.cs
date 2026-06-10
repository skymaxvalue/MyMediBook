using MediatR;
using Medicare.Application.Features.Queries.Doctor;
using Medicare.Application.Interfaces.IDoctor;
using Medicare.Application.Models.Doctor;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetDoctorListQueryHandler : IRequestHandler<GetDoctorListQuery, List<DoctorCategoryModel>>
    {
        private readonly IDoctorRepository _doctorRepository;
        public GetDoctorListQueryHandler(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }
        public async Task<List<DoctorCategoryModel>> Handle(GetDoctorListQuery request, CancellationToken cancellationToken)
        {
            var result = await _doctorRepository.GetDoctorListAsync();
            var returnData = result
             .GroupBy(x => new
             {
                 x.SpecialityId,
                 x.Category
             })
            .Select(g => new DoctorCategoryModel
            {
                SpecialityId = g.Key.SpecialityId,
                Category = g.Key.Category,
                Doctors = g.Select(d => new DoctorProfileModel
                {
                    DoctorId = d.DoctorId,
                    Name = d.Name,
                    Degree = d.Degree,
                    Image = d.Image,
                    Department = d.Department,
                    AvailableFrom = d.AvailableFrom,
                    AvailableTo = d.AvailableTo
                }).ToList()
            })
            .ToList();
            return returnData;
        }
    }
}
