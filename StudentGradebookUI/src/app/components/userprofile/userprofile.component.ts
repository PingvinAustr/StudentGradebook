import { Component, OnInit } from '@angular/core';
import { CurrentUserInfo } from 'src/app/models/currentuserinfo.model';
import { UserService } from 'src/app/services/user/user-service.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Group } from 'src/app/models/group.model';
import { CafedraService } from 'src/app/services/cafedra/cafedra.service';
import { Cafedra } from 'src/app/models/cafedra.model';
import { Discipline } from 'src/app/models/discipline.model';
import { Assignment } from 'src/app/models/assignment.model';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import { HorizontalBarChartOptions } from 'src/assets/charts.options';
import { TranslationService } from 'src/app/services/translation/translation-service.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(private userService: UserService,
    private groupService: GroupService,
    private cafedraService: CafedraService,
    private assignmentService: AssignmentService,
    private translationService: TranslationService) { }

  Role: string;
  CurrentUser: CurrentUserInfo;
  Group: Group;
  Cafedra: Cafedra;

  displayedColumns: string[] = ['name', 'assignments'];
  disciplines: Discipline[];

  displayedAssignmentsColumns: string[] = ['name', 'grade', 'disciplineName', 'gradeDate'];
  assignments: Assignment[];

  ngOnInit(): void {
    var user = this.userService.getUser();
    this.CurrentUser = user;
    console.log(this.CurrentUser);
    this.DefineRole();
    this.DefineGroup();
    (this.Role === 'Teacher') && this.DefineCafedraById(this.CurrentUser['teacher'].cafedraId);
    this.DefineDisciplines();
    this.DefineAssignments();
    this.DefineAvgStudentGrades();
  }

  horizontalBarChartOptions: Partial<HorizontalBarChartOptions>;
  DefineAvgStudentGrades() {
    var user = this.userService.getUser();
    let allAssignmentsForStudent: Assignment[];
    if (user['role'] !== 1) return;
    this.assignmentService.getAllAssignmentsForStudent(user['student']['entryId'])
    .subscribe(data => {
      allAssignmentsForStudent = data;
      console.log(data);
      this.InitStudentChart(allAssignmentsForStudent);
    });
  }

  InitStudentChart(assignments) {
    let disciplineGrades = {};
    
    assignments.forEach(assignment => {
      const { discipline, grade } = assignment;
      if (!disciplineGrades[discipline.name]) {
        disciplineGrades[discipline.name] = { total: 0, count: 0 };
      }
      if (assignment.gradeDate) {
        disciplineGrades[discipline.name].total += grade;
        disciplineGrades[discipline.name].count++;
      }
    });

    const categories = Object.keys(disciplineGrades);
    const data = categories.map(name => Math.round(disciplineGrades[name].total / disciplineGrades[name].count));


    this.horizontalBarChartOptions = {
      series: [
        {
          name: this.translationService.translate('lblAverageGrade'),
          data: data
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories
      }
    };
  }

  DefineRole() {
    if (this.CurrentUser['role'] === 1) this.Role='Student';
    else this.Role = 'Teacher'
  }

  DefineGroup() {
    if (this.Role === 'Teacher') return;
    this.groupService.getGroupById(this.CurrentUser['student'].groupId).subscribe({
      next: (data) => {
        this.Group = data;
        this.DefineCafedraById(this.Group.cafedraId);
        console.log(this.Group);
      },
      error: (error) => {
        console.error('Error fetching group:', error);
      }
    });
  }

  DefineCafedraById(id) {
    this.cafedraService.getCafedra(id).subscribe({
      next: (data) => {
        this.Cafedra = data;
        console.log(this.Cafedra);
      },
      error: (error) => {
        console.error('Error fetching cafedra:', error);
      }
    });
  }

  DefineDisciplines() {
    if (this.Role !== 'Teacher') return;
    this.disciplines = this.CurrentUser['teacher'].disciplines;
    console.log(this.disciplines);
  }

  DefineAssignments() {
    if (this.Role !== 'Student') return;
    this.assignments = this.CurrentUser['student'].assignments;
    const assignmentsWithDates = this.CurrentUser['student'].assignments.filter(a => a.gradeDate);

    // Sort assignments by gradeDate, descending (most recent first)
    assignmentsWithDates.sort((a, b) => {
      // Convert gradeDate strings to Date objects for comparison
      const dateA = new Date(a.gradeDate);
      const dateB = new Date(b.gradeDate);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });

    // Select the top 10 most recent entries
    this.assignments = assignmentsWithDates.slice(0, 10);
  }

  GetFormattedDate(date: any): string {
    if (!date) return ''; // Handle null, undefined, or empty date inputs

    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) { // Check if the date is valid
      return parsedDate.toLocaleDateString('en-GB'); // UK format gives you dd/mm/yyyy
    } else {
      return 'Invalid date'; // Or handle as you see fit
    }
  }
}
