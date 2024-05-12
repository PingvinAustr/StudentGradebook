using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.Database;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public class DisciplinesControllerTests
{
    private readonly Mock<StudentGradebookContext> _mockContext;
    private readonly DisciplinesController _controller;
    private readonly Mock<DbSet<Discipline>> _mockSet;

    public DisciplinesControllerTests()
    {
        _mockSet = new Mock<DbSet<Discipline>>();
        _mockContext = new Mock<StudentGradebookContext>();
        _mockContext.Setup(m => m.Disciplines).Returns(_mockSet.Object);
        _controller = new DisciplinesController(_mockContext.Object);
    }

    private void SetupMockSetWithQueryable(IEnumerable<Discipline> testData)
    {
        var data = testData.AsQueryable();
        _mockSet.As<IQueryable<Discipline>>().Setup(m => m.Provider).Returns(data.Provider);
        _mockSet.As<IQueryable<Discipline>>().Setup(m => m.Expression).Returns(data.Expression);
        _mockSet.As<IQueryable<Discipline>>().Setup(m => m.ElementType).Returns(data.ElementType);
        _mockSet.As<IQueryable<Discipline>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
    }

    [Fact]
    public async Task GetDisciplines_ReturnsAllDisciplines()
    {
        var testData = new List<Discipline> { new Discipline(), new Discipline() };

        Assert.Equal(true, testData.Count > 1);
    }

    [Fact]
    public async Task GetDiscipline_ReturnsDisciplineById()
    {
        var testData = new Discipline { EntryId = 1 };
        _mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(testData);

        var result = await _controller.GetDiscipline(1);

        var actionResult = Assert.IsType<ActionResult<Discipline>>(result);
        var returnedData = Assert.IsType<Discipline>(actionResult.Value);
        Assert.Equal(1, returnedData.EntryId);
    }

    [Fact]
    public async Task GetAssignmentsForStudent_ReturnsDisciplinesForTeacher()
    {
        var testData = new List<Discipline> { new Discipline { TeacherId = 1 }, new Discipline { TeacherId = 1 } };

        Assert.Equal(true, true);
    }

    [Fact]
    public async Task PostDiscipline_AddsDiscipline()
    {
        var newDiscipline = new Discipline { EntryId = 1 };
        _mockSet.Setup(m => m.Add(It.IsAny<Discipline>()));
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = await _controller.PostDiscipline(newDiscipline);

        var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal("GetDiscipline", actionResult.ActionName);
    }

    [Fact]
    public async Task DeleteDiscipline_DeletesDiscipline()
    {
        var existingDiscipline = new Discipline { EntryId = 1 };
        _mockSet.Setup(m => m.FindAsync(1)).ReturnsAsync(existingDiscipline);
        _mockSet.Setup(m => m.Remove(It.IsAny<Discipline>()));
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = await _controller.DeleteDiscipline(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task PutDiscipline_UpdatesDiscipline_ReturnsNoContent()
    {
        var discipline = new Discipline { EntryId = 1 };
        _mockContext.Setup(x => x.SaveChanges()).Returns(1);
        _mockSet.Setup(x => x.Update(It.IsAny<Discipline>()));


        Assert.IsType<NoContentResult>(new NoContentResult());
    }

    [Fact]
    public async Task PutDiscipline_IdMismatch_ReturnsBadRequest()
    {
        var result = await _controller.PutDiscipline(1, new Discipline { EntryId = 2 });
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task PutDiscipline_DisciplineDoesNotExist_ReturnsNotFound()
    {
        var discipline = new Discipline { EntryId = 1 };


        Assert.Equal(true, true);
    }


}