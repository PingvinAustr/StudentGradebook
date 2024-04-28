using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentGradebookWebAPI.DTO;
using StudentGradebookWebAPI.Services;

namespace StudentGradebookWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("getcurrentuser")]
        public ActionResult<CurrentUserInfo> GetCurrentUser()
        {
            return Ok(UserService.CurrentUser);
        }
    }
}
