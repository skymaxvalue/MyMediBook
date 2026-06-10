namespace Medicare.Application.Models.Doctor
{
    public class DoctorCategoryModel
    {
        public int SpecialityId { get; set; }
        public string Category { get; set; }
        public List<DoctorProfileModel> Doctors { get; set; }
    }
    public class DoctorProfileModel
    {
        public int DoctorId { get; set; }
        public string Name { get; set; }
        public string Degree { get; set; }
        public string Image { get; set; }
        public string Department { get; set; }
        public string AvailableFrom { get; set; }
        public string AvailableTo { get; set; }
    }
    public class DoctorItemModel
    {
        public int SpecialityId { get; set; }
        public string Category { get; set; }
        public int DoctorId { get; set; }
        public string Name { get; set; }
        public string Degree { get; set; }
        public string Image { get; set; }
        public string Department { get; set; }
        public string AvailableFrom { get; set; }
        public string AvailableTo { get; set; }
    }
}
