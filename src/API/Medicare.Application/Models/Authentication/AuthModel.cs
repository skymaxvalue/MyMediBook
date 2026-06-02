namespace Medicare.Application.Models.Authentication
{
    public class PatientAuthModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

    }

    public class PatientAuthDetailModel
    {
        public int UserId { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
