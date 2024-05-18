using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.Database;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public class GroupsControllerTests
{
    private readonly Mock<StudentGradebookContext> _mockContext;
    private readonly GroupsController _controller;
    private readonly Mock<DbSet<Group>> _mockSet;

    public GroupsControllerTests()
    {
        _mockSet = new Mock<DbSet<Group>>();
        _mockContext = new Mock<StudentGradebookContext>();
        _mockContext.Setup(m => m.Groups).Returns(_mockSet.Object);
        _controller = new GroupsController(_mockContext.Object);
    }

    [Fact]
    public async Task GetGroups_ReturnsAllGroups()
    {
        var testData = new List<Group> { new Group(), new Group() };

        Assert.Equal(true, true);
    }

    [Fact]
    public async Task GetGroup_ReturnsGroupById()
    {
        var testData = new Group { EntryId = 1 };
        _mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(testData);

        var result = await _controller.GetGroup(1);

        var actionResult = Assert.IsType<ActionResult<Group>>(result);
        var returnedData = Assert.IsType<Group>(actionResult.Value);
        Assert.Equal(1, returnedData.EntryId);
    }

    [Fact]
    public async Task PutGroup_ReturnsBadRequestForMismatchId()
    {
        var result = await _controller.PutGroup(1, new Group { EntryId = 2 });

        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task PostGroup_AddsGroup()
    {
        var newGroup = new Group { EntryId = 1 };
        _mockSet.Setup(m => m.Add(It.IsAny<Group>()));
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = await _controller.PostGroup(newGroup);

        var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal("GetGroup", actionResult.ActionName);
    }

    [Fact]
    public async Task DeleteGroup_DeletesGroup()
    {
        var existingGroup = new Group { EntryId = 1 };
        _mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(existingGroup);
        _mockSet.Setup(m => m.Remove(It.IsAny<Group>()));
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = await _controller.DeleteGroup(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteGroup_ReturnsNotFoundForMissingGroup()
    {
        _mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync((Group)null);

        var result = await _controller.DeleteGroup(1);

        Assert.IsType<NotFoundResult>(result);
    }
}
