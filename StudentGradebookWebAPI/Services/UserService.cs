using Microsoft.AspNetCore.Mvc;
using StudentGradebookWebAPI.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace StudentGradebookWebAPI.Services
{
    public static class UserService
    {
        public static CurrentUserInfo CurrentUser { get; set; }
    }
}
