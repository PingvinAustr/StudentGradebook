using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Group
{
    public int EntryId { get; set; }

    public string? Name { get; set; }

    public int? CafedraId { get; set; }

    public virtual Cafedra? Cafedra { get; set; }

    public virtual ICollection<SemesterControlSchedule> SemesterControlSchedules { get; set; } = new List<SemesterControlSchedule>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
