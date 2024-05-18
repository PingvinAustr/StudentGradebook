using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.Database;

public class CafedraControllerTests
{
    private readonly Mock<StudentGradebookContext> _mockContext;
    private readonly CafedraController _controller;
    private readonly Mock<DbSet<Cafedra>> _mockSet;

    public CafedraControllerTests()
    {
        _mockContext = new Mock<StudentGradebookContext>();
        _mockSet = new Mock<DbSet<Cafedra>>();
        _mockContext.Setup(m => m.Cafedras).Returns(_mockSet.Object);
        _controller = new CafedraController(_mockContext.Object);
    }

    private void SetupMockSetWithQueryable(IEnumerable<Cafedra> testData)
    {
        var data = testData.AsQueryable();
        _mockSet.As<IQueryable<Cafedra>>().Setup(m => m.Provider).Returns(data.Provider);
        _mockSet.As<IQueryable<Cafedra>>().Setup(m => m.Expression).Returns(data.Expression);
        _mockSet.As<IQueryable<Cafedra>>().Setup(m => m.ElementType).Returns(data.ElementType);
        _mockSet.As<IQueryable<Cafedra>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
    }

    [Fact]
    public async Task GetCafedras_ReturnsAllCafedras()
    {
        var testData = new List<Cafedra>
    {
        new Cafedra { EntryId = 1, Name = "Cafedra1" },
        new Cafedra { EntryId = 2, Name = "Cafedra2" }
    };
        SetupMockSetWithQueryable(testData);

        Assert.Equal(2, testData.Count);
    }

    [Fact]
    public async Task GetCafedra_ReturnsCafedraById()
    {
        var testData = new List<Cafedra>
    {
        new Cafedra { EntryId = 1, Name = "Cafedra1" },
        new Cafedra { EntryId = 2, Name = "Cafedra2" }
    };
        SetupMockSetWithQueryable(testData);

        var result = await _controller.GetCafedra(1);

        var okResult = Assert.IsType<OkResult>(new OkResult());
        Assert.Equal("Cafedra1", testData.First().Name);
    }

    [Fact]
    public async Task GetCafedra_ReturnsNotFound()
    {
        SetupMockSetWithQueryable(new List<Cafedra>());

        var result = await _controller.GetCafedra(1);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task PostCafedra_AddsCafedra_ReturnsCreatedAtAction()
    {
        var newCafedra = new Cafedra { EntryId = 1, Name = "New Cafedra" };
        _mockSet.Setup(m => m.Add(It.IsAny<Cafedra>()));
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = await _controller.PostCafedra(newCafedra);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var cafedra = Assert.IsType<Cafedra>(createdAtActionResult.Value);
        Assert.Equal("New Cafedra", cafedra.Name);
    }


    [Fact]
    public async Task PutCafedra_UpdatesCafedra_ReturnsNoContent()
    {
        var existingCafedra = new Cafedra { EntryId = 1, Name = "Existing Cafedra" };
        SetupMockSetWithQueryable(new List<Cafedra> { existingCafedra });
        _mockContext.Setup(x => x.SaveChanges()).Returns(1);
        _mockSet.Setup(x => x.Update(It.IsAny<Cafedra>()));

        Assert.IsType<NoContentResult>(new NoContentResult());
    }

    [Fact]
    public async Task PutCafedra_IdMismatch_ReturnsBadRequest()
    {
        var result = await _controller.PutCafedra(1, new Cafedra { EntryId = 2 });

        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task PutCafedra_CafedraDoesNotExist_ReturnsNotFound()
    {
        SetupMockSetWithQueryable(new List<Cafedra>());
        var cafedra = new Cafedra { EntryId = 1 };

        Assert.IsType<NotFoundResult>(new NotFoundResult());
    }


    [Fact]
    public async Task DeleteCafedra_DeletesCafedra_ReturnsNoContent()
    {
        var existingCafedra = new Cafedra { EntryId = 1 };
        SetupMockSetWithQueryable(new List<Cafedra> { existingCafedra });

        var result = await _controller.DeleteCafedra(1);

        Assert.IsType<NoContentResult>(new NoContentResult());
    }

    [Fact]
    public async Task DeleteCafedra_CafedraNotFound_ReturnsNotFound()
    {
        SetupMockSetWithQueryable(new List<Cafedra>());

        var result = await _controller.DeleteCafedra(1);

        Assert.IsType<NotFoundResult>(result);
    }


}
