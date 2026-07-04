using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.JwtTokens;
using System.Security.Claims;

namespace Medicare.Application.Interfaces.JwtToken
{
    public interface IJwtTokenRepository
    {
        string GenerateToken(JwtTokenClaimModel model);
        string GenerateRefreshToken();                           
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GeneratePasswordResetToken(string userId, string employeeId);
    }
}
