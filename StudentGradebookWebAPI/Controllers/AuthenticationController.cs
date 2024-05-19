using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using StudentGradebookWebAPI.Database;
using StudentGradebookWebAPI.DTO;
using StudentGradebookWebAPI.Services;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace StudentGradebookWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly StudentGradebookContext _context;

        public AuthenticationController(StudentGradebookContext context)
        {
            _context = context;
        }

        [HttpPost("register/student")]
        public async Task<ActionResult<Student>> RegisterStudent([FromBody] StudentRegistrationDto studentDto)
        {
            if (await _context.WebApicredentials.AnyAsync(x => x.UserName == studentDto.UserName))
                return BadRequest("Username already exists.");

            var webApiCredential = new WebApicredential
            {
                UserName = studentDto.UserName,
                Password = studentDto.Password
            };

            // Add and save WebApiCredential first to ensure a unique EntryId is generated
            _context.WebApicredentials.Add(webApiCredential);
            await _context.SaveChangesAsync();

            var student = new Student
            {
                FirstName = studentDto.FirstName,
                MiddleName = studentDto.MiddleName,
                LastName = studentDto.LastName,
                BirthDate = studentDto.BirthDate,
                GroupId = studentDto.GroupId,
                WebApiCredentialId = webApiCredential.EntryId // Use the generated EntryId
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }


        [HttpPost("register/teacher")]
        public async Task<ActionResult<Teacher>> RegisterTeacher([FromBody] TeacherRegistrationDto teacher)
        {
            if (await _context.WebApicredentials.AnyAsync(x => x.UserName == teacher.UserName))
                return BadRequest("Username already exists.");

            var webApiCredential = new WebApicredential
            {
                UserName = teacher.UserName,
                Password = teacher.Password
            };

            // Add and save WebApiCredential first to ensure a unique EntryId is generated
            _context.WebApicredentials.Add(webApiCredential);
            await _context.SaveChangesAsync();

            var teacherToAdd = new Teacher
            {
                FirstName = teacher.FirstName,
                MiddleName = teacher.MiddleName,
                LastName = teacher.LastName,
                BirthDate = teacher.BirthDate,
                CafedraId = teacher.CafedraID,
                WebApiCredentialId = webApiCredential.EntryId
            };

            _context.Teachers.Add(teacherToAdd);
            await _context.SaveChangesAsync();

            return Ok(teacherToAdd);
        }

        [HttpPost("login")]
        public async Task<ActionResult<dynamic>> Login([FromBody] LoginDto loginDto)
        {
            System.Threading.Thread.Sleep(2000);
            var user = await _context.WebApicredentials
                .FirstOrDefaultAsync(u => u.UserName == loginDto.UserName && u.Password == loginDto.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            var isTeacher = _context.Teachers.Any(x => x.WebApiCredentialId == user.EntryId);
            var token = GenerateJwtToken(user, isTeacher);

            var response = new
            {
                Token = token,
                UserName = user.UserName,
                Role = isTeacher ? Roles.Teacher : Roles.Student,
                WebAPICredentialID = user.EntryId,
                Student = !isTeacher ? await _context.Students
                    .Where(x => x.WebApiCredentialId == user.EntryId).Include(x => x.Group)
                    .Include(t => t.Assignments).ThenInclude(tt => tt.Discipline)
                    .FirstOrDefaultAsync() : null,
                Teacher = isTeacher ? await _context.Teachers
                                  .Where(x => x.WebApiCredentialId == user.EntryId)
                                  .Include(t => t.Disciplines).ThenInclude(tt => tt.Assignments)
                                  .FirstOrDefaultAsync() : null
            };

            return Ok(response);
        }

        private string GenerateJwtToken(WebApicredential user, bool isTeacher)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my_secret_key_here_very__very__very__very__very_long"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, isTeacher ? "Teacher" : "Student"),
                new Claim("UserID", user.EntryId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "JwtIssuer",
                audience: "JwtAudience",
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
