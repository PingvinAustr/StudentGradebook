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

    public virtual Discipline Discipline { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
