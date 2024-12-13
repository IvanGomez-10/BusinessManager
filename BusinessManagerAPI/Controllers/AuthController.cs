using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    [HttpPost("verifyToken")]
    public async Task<IActionResult> VerifyToken()
    {
        var authorizationHeader = Request.Headers["Authorization"].ToString();
        var token = authorizationHeader.Replace("Bearer ", "");

        try
        {
            // Verifica el token de ID
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
            return Ok(new { success = true, uid = decodedToken.Uid });
        }
        catch (FirebaseAuthException ex)
        {
            return Unauthorized(new { success = false, message = "Invalid token", error = ex.Message });
        }
    }
}
