using Xunit;
using Microsoft.AspNetCore.Mvc;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.DTO;

public class UserControllerTests
{
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _controller = new UserController();
    }

    [Fact]
    public void GetCurrentUser_ReturnsCurrentUserInfo()
    {
        // Arrange

        // Act
        var result = _controller.GetCurrentUser();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
    }
}
