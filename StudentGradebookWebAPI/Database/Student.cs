using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Student
{
    public int EntryId { get; set; }

    public string FirstName { get; set; } = null!;

    public string MiddleName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly? BirthDate { get; set; }

    public int WebApiCredentialId { get; set; }

    public int GroupId { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? AvatarImage { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    public virtual Group Group { get; set; } = null!;

    public virtual WebApicredential WebApiCredential { get; set; } = null!;
}
