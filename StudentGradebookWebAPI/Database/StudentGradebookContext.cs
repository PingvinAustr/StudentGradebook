using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace StudentGradebookWebAPI.Database;

public partial class StudentGradebookContext : DbContext
{
    public StudentGradebookContext()
    {
    }

    public StudentGradebookContext(DbContextOptions<StudentGradebookContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assignment> Assignments { get; set; }

    public virtual DbSet<Cafedra> Cafedras { get; set; }

    public virtual DbSet<Discipline> Disciplines { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<WebApicredential> WebApicredentials { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-77MT8LVK;Database=StudentGradebook;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__Assignme__F57BD2D7AE8A7AEA");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.DisciplineId).HasColumnName("DisciplineID");
            entity.Property(e => e.GradeDate).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Discipline).WithMany(p => p.Assignments)
                .HasForeignKey(d => d.DisciplineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Assignmen__Disci__46E78A0C");

            entity.HasOne(d => d.Student).WithMany(p => p.Assignments)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Assignmen__Stude__45F365D3");
        });

        modelBuilder.Entity<Cafedra>(entity =>
        {
            entity.HasKey(e => e.EntryId);

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Discipline>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__Discipli__F57BD2D71A74C778");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.TeacherId).HasColumnName("TeacherID");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Disciplines)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Disciplin__Teach__4316F928");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.EntryId);

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.CafedraId).HasColumnName("CafedraID");
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Cafedra).WithMany(p => p.Groups)
                .HasForeignKey(d => d.CafedraId)
                .HasConstraintName("FK__Groups__CafedraI__25869641");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__Students__F57BD2D7B7969DDC");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.AvatarImage).HasColumnType("text");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.MiddleName).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(100);
            entity.Property(e => e.WebApiCredentialId).HasColumnName("WebApiCredentialID");

            entity.HasOne(d => d.Group).WithMany(p => p.Students)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Students__GroupI__31EC6D26");

            entity.HasOne(d => d.WebApiCredential).WithMany(p => p.Students)
                .HasForeignKey(d => d.WebApiCredentialId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Students__WebApi__30F848ED");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__Teachers__F57BD2D7E4F44C0B");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.AvatarImage).HasColumnType("text");
            entity.Property(e => e.CafedraId).HasColumnName("CafedraID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.MiddleName).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(100);
            entity.Property(e => e.WebApiCredentialId).HasColumnName("WebApiCredentialID");

            entity.HasOne(d => d.Cafedra).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.CafedraId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Teachers__Cafedr__403A8C7D");

            entity.HasOne(d => d.WebApiCredential).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.WebApiCredentialId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Teachers__WebApi__3F466844");
        });

        modelBuilder.Entity<WebApicredential>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PK__WebAPICr__F57BD2D71FB69375");

            entity.ToTable("WebAPICredentials");

            entity.Property(e => e.EntryId).HasColumnName("EntryID");
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.UserName).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
