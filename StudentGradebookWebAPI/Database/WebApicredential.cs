using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class WebApicredential
{
    public int EntryId { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}
