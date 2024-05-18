using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class SemesterControlType
{
    public int EntryId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<SemesterControlSchedule> SemesterControlSchedules { get; set; } = new List<SemesterControlSchedule>();
}
