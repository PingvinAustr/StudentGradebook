using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Assignment
{
    public int EntryId { get; set; }

    public string Name { get; set; } = null!;

    public int StudentId { get; set; }

    public int DisciplineId { get; set; }

    public int? Grade { get; set; }

    public DateTime? GradeDate { get; set; }

    public DateTime? DueDate { get; set; }

    public bool? IsViewedByStudent { get; set; }

    public bool? IsViewedByTeacher { get; set; }

    public int? StatusId { get; set; }

    public virtual ICollection<AssignmentDetail> AssignmentDetails { get; set; } = new List<AssignmentDetail>();

    public virtual Discipline Discipline { get; set; } = null!;

    public virtual Status? Status { get; set; }

    public virtual Student Student { get; set; } = null!;
}
