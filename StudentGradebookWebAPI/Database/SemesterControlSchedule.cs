using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class SemesterControlSchedule
{
    public int EntryId { get; set; }

    public int ControlTypeId { get; set; }

    public int GroupId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public virtual SemesterControlType ControlType { get; set; } = null!;

    public virtual Group Group { get; set; } = null!;
}
