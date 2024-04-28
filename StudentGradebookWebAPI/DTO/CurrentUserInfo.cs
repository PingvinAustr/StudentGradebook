using StudentGradebookWebAPI.Database;

namespace StudentGradebookWebAPI.DTO
{
    public enum Roles
    {
        Teacher,
        Student
    }

    public class CurrentUserInfo
    {
        public string UserName { get; set; }
        public int WebAPICredentialID { get; set; }
        public Roles Role { get; set; }
        public Teacher Teacher { get; set; }
        public Student Student { get; set; }
    }
}
