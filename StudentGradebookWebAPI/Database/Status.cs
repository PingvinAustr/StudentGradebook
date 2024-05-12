using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Status
{
    public int EntryId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}
