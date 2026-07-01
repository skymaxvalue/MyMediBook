using Medicare.Application.Models.Associate;
using Medicare.Application.Models.JwtTokens;
using Medicare.Application.Models.Patient;
using System.Security.Claims;

namespace Medicare.Application.Interfaces.JwtToken
{
    public interface IJwtTokenRepository
    {
        string GenerateToken(JwtTokenClaimModel model);
        string GenerateRefreshToken();                           
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
