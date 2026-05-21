using Medicare.Application.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Interfaces.IAuthRepository
{
    public interface IAuthRepository
    {
        Task<AuthDetailModel> GetPasswordByUsernameAsync(string Username);
    }
}
