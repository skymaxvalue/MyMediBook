namespace Medicare.Application.Models.Patient
{
    public class PatientProfileModel
    {
        public int PatientId { get; set; }
        public int ProfileId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Relationtype { get; set; }
    }
}
