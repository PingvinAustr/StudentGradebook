using System;
using System.Collections.Generic;

namespace StudentGradebookWebAPI.Database;

public partial class Teacher
{
    public int EntryId { get; set; }

    public string FirstName { get; set; } = null!;

    public string MiddleName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly? BirthDate { get; set; }

    public int WebApiCredentialId { get; set; }

    public int CafedraId { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? AvatarImage { get; set; }

    public virtual Cafedra Cafedra { get; set; } = null!;

    public virtual ICollection<Discipline> Disciplines { get; set; } = new List<Discipline>();

    public virtual WebApicredential WebApiCredential { get; set; } = null!;
}
