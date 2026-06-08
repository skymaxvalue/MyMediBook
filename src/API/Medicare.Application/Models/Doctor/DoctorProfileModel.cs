namespace Medicare.Application.Models.Doctor
{
    public class DoctorProfileModel              
    {
        public int DoctorId { get; set; }
        public string Name { get; set; }
        public string Speciality { get; set; }
        public string Department { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
