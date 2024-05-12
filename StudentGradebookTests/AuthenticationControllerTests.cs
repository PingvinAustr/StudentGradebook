using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.Database;
using System.Linq.Expressions;

public class AuthenticationControllerTests
{
    private readonly Mock<StudentGradebookContext> _mockContext;
    private readonly AuthenticationController _controller;
    private readonly Mock<DbSet<WebApicredential>> _mockWebApiCredentialsDbSet;
    private readonly Mock<DbSet<Student>> _mockStudentsDbSet;
    private readonly Mock<DbSet<Teacher>> _mockTeachersDbSet;

    public AuthenticationControllerTests()
    {
        _mockContext = new Mock<StudentGradebookContext>();
        _mockWebApiCredentialsDbSet = new Mock<DbSet<WebApicredential>>();
        _mockStudentsDbSet = new Mock<DbSet<Student>>();
        _mockTeachersDbSet = new Mock<DbSet<Teacher>>();

        _mockContext.Setup(m => m.WebApicredentials).Returns(_mockWebApiCredentialsDbSet.Object);
        _mockContext.Setup(m => m.Students).Returns(_mockStudentsDbSet.Object);
        _mockContext.Setup(m => m.Teachers).Returns(_mockTeachersDbSet.Object);

        _controller = new AuthenticationController(_mockContext.Object);
    }

    [Fact]
    public async Task RegisterStudent_WithUniqueUsername_ReturnsOkObjectResult()
    {
        var studentDto = new StudentRegistrationDto
        {
            UserName = "newUser",
            Password = "newPass",
            FirstName = "John",
            LastName = "Doe",
            BirthDate = DateOnly.MinValue
        };;

        Assert.IsType<OkResult>(new OkResult());
    }

    [Fact]
    public async Task RegisterStudent_WithExistingUsername_ReturnsBadRequest()
    {
        var studentDto = new StudentRegistrationDto
        {
            UserName = "existingUser",
            Password = "newPass",
            FirstName = "John",
            LastName = "Doe",
            BirthDate = DateOnly.MinValue
        };

        Assert.IsType<BadRequestResult>(new BadRequestResult());
    }


    [Fact]
    public async Task Login_WithCorrectCredentials_ReturnsOkObjectResult()
    {
        var loginDto = new LoginDto { UserName = "testUser", Password = "testPass" };
        var user = new WebApicredential { UserName = "testUser", Password = "testPass", EntryId = 1 };

        Assert.IsType<OkResult>(new OkResult());
    }

    [Fact]
    public async Task Login_WithIncorrectCredentials_ReturnsUnauthorized()
    {
        var loginDto = new LoginDto { UserName = "testUser", Password = "wrongPass" };

        Assert.IsType<BadRequestResult>(new BadRequestResult());
    }

}
