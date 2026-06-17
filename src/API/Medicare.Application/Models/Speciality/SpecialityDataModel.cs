namespace Medicare.Application.Models.Speciality
{
    public class SpecialityDataModel
    {
        public int SpecialityId { get; set; }
        public int AssociateId { get; set; }
        public string SpecialityName { get; set; }
        public string DepartmentName { get; set; }
        public string DoctorName { get; set; }
    }
}
