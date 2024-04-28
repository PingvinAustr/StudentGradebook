using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Cafedra
{
    public int EntryId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();

    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}
