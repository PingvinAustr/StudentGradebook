﻿public class StudentRegistrationDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateOnly BirthDate { get; set; }
    public int GroupId { get; set; }
}