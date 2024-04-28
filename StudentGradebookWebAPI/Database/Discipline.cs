using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Discipline
{
    public int EntryId { get; set; }

    public string Name { get; set; } = null!;

    public int TeacherId { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    public virtual Teacher Teacher { get; set; } = null!;
}
