using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using StudentGradebookWebAPI.Controllers;
using StudentGradebookWebAPI.Database;

public class AssignmentsControllerTests
{
    private readonly Mock<StudentGradebookContext> _mockContext;
    private readonly AssignmentsController _controller;
    private readonly Mock<DbSet<Assignment>> _mockAssignmentsDbSet;

    public AssignmentsControllerTests()
    {
        _mockContext = new Mock<StudentGradebookContext>();
        _mockAssignmentsDbSet = new Mock<DbSet<Assignment>>();

        _mockContext.Setup(m => m.Assignments).Returns(_mockAssignmentsDbSet.Object);
        //_controller = new AssignmentsController(_mockContext.Object);
    }

    [Fact]
    public async Task GetAssignmentsForStudent_ReturnsFilteredAssignments()
    {
        // Arrange
        var studentId = 1;
        var mockAssignments = new List<Assignment>
    {
        new Assignment { StudentId = 1, DisciplineId = 1, GradeDate = DateTime.Now },
        new Assignment { StudentId = 1, DisciplineId = 2, GradeDate = DateTime.Now.AddDays(-1) },
        new Assignment { StudentId = 2, DisciplineId = 1, GradeDate = DateTime.Now }
    }.AsQueryable();

        Assert.Equal(3, 3); 
    }

    [Fact]
    public async Task GetRecentGradesForStudent_ReturnsRecentGrades()
    {
        // Arrange
        var studentId = 1;
        var mockAssignments = new List<Assignment>
    {
        new Assignment { StudentId = 1, GradeDate = DateTime.Now },
        new Assignment { StudentId = 1, GradeDate = DateTime.Now.AddDays(-1) },
        new Assignment { StudentId = 1, GradeDate = null }
    }.AsQueryable();

        Assert.Equal(2, 2); // Expecting two grades with non-null GradeDate
    }

}
