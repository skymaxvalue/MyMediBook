namespace Medicare.Application.Models.Authentication
{
    public class AuthModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

    }

    public class AuthDetailModel
    {
        public int UserId { get; set; }
        public string PasswordHash { get; set; }
    }
}
