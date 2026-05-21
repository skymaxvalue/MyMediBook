using System;
using System.Collections.Generic;
using System.Text;

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
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
