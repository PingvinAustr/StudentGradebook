using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class AssignmentDetail
{
    public int EntryId { get; set; }

    public string? Description { get; set; }

    public string? ImageAttachment1 { get; set; }

    public string? ImageAttachment2 { get; set; }

    public string? ImageAttachment3 { get; set; }

    public string? FileAttachment1 { get; set; }

    public string? FileAttachment2 { get; set; }

    public string? FileAttachment3 { get; set; }

    public int AssignmentId { get; set; }

    public virtual Assignment Assignment { get; set; } = null!;
}
