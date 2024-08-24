import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { MatDialog } from '@angular/material/dialog';
import { GradeDetailPopupComponent } from '../grade-details-popup/grade-detail-popup/grade-detail-popup.component';
import { FullscreenGradeTableComponent } from '../fullscreen-grade-table/fullscreen-grade-table.component';
import { TodDoAssignmentsPopupComponent } from '../to-do-assignment-popup/to-do-assignment-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeStudentPopup } from '../grade-student-popup/grade-student-popup.component';
import { GroupService } from 'src/app/services/group/group.service';
import { DisciplineService } from 'src/app/services/disciplines/disciplines.service';
import { Group } from 'src/app/models/group.model';
import { Discipline } from 'src/app/models/discipline.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gradebook-teacher',
  templateUrl: './gradebook-teacher.component.html',
  styleUrls: ['./gradebook-teacher.component.scss']
})
export class GradebookTeacherComponent implements OnInit {

  constructor(private translationService: TranslationService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private groupService: GroupService,
    private disciplineService: DisciplineService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      semester: [''],
      group: [''],
      discipline: ['']
    });
   }

  semesters = [];

  semestersEN = [
    'I Semester',
    'II Semester',
    'III Semester',
    'IV Semester',
    'V Semester',
    'VI Semester',
    'VII Semester',
    'VIII Semester'
  ];

  semestersUA = [
    'I Семестр',
    'II Семестр',
    'III Семестр',
    'IV Семестр',
    'V Семестр',
    'VI Семестр',
    'VII Семестр',
    'VIII Семестр'
  ];

  selectedSemester: string;
  selectedGroup: Group;
  selectedDiscipline: Discipline;
  groups: Group[] = [];
  disciplines: Discipline[] = [];
  uniqueDates: string[] = [];
  assignments: Assignment[] = [];
  uniqueStudents: any[] = []; // Use appropriate type for unique student details
  dateFrom: Date;
  dateTo: Date;
  filterForm: FormGroup;

  FormatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  activeTabIndex: number = 0;
    onTabChange(index: number): void {
      this.activeTabIndex = index;
      if (this.activeTabIndex === 0) {
        this.loadToCheckAssignments();
      } else if (this.activeTabIndex === 1) {
        //this.loadDoneNonCheckedAssignments();
      }
    }

  loadTodoAssignments() {
     const studentID = this.userService.getUser()['student'].entryId;
     this.assignmentService.getToDoAssignmentsForStudent(studentID).subscribe(data => {
      this.todoAssignments = data;
    });
  }

  loadToCheckAssignments() {
     const teacherId = this.userService.getUser()['teacher'].entryId;
     console.log(teacherId);
     this.assignmentService.getToCheckAssignmentsForTeacher(teacherId).subscribe(data => {
      console.log(data);
      this.toCheckAssignments = data;
    });
  }

  ngOnInit(): void {
     this.semesters = this.translationService.currentLang === 'EN' ? this.semestersEN : this.semestersUA;
     this.selectedSemester = this.semesters[7];
     
     this.popoverConfig.container = 'body'; // To append to the body instead of the component
    this.onSemesterChange(this.selectedSemester);
    this.loadGroups();
    this.loadDisciplines();
    this.loadToCheckAssignments();
  }

  uniqueDisciplines: any[] = [];
  todoAssignments: Assignment[] = [];
  toCheckAssignments: Assignment[] = [];

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  loadDisciplines() {
    const teacherId = this.userService.getUser()['teacher'].entryId;
    this.disciplineService.getDisciplinesByTeacher(teacherId).subscribe(disciplines => {
      this.disciplines = disciplines;
    });
  }

  onFiltersChange(selectedSemester) {
    console.log(selectedSemester);
    this.onSemesterChange(selectedSemester.value);
    //this.loadGrid();
  }

  onGroupChange(group) {
    console.log(group);
    this.selectedGroup = group.value;
  }

  onDisciplineChange(discipline) {
    console.log(discipline);
    this.selectedDiscipline = discipline.value;
  }


   onSemesterChange(semester: string) {
    if (semester['value']) {
      semester = semester['value']
    }
    const semesterIndex = this.semesters.indexOf(semester) + 1;
    const year = 2024 - Math.floor((8 - semesterIndex) / 2);

    if (semesterIndex % 2 === 1) { 
      this.dateFrom = new Date(year - 1, 8, 1); 
      this.dateTo = new Date(year - 1, 11, 31); 
    } else { 
      this.dateFrom = new Date(year, 1, 1);
      this.dateTo = new Date(year, 5, 15);
    }
  }


  getStatusText(statusId: number): string {
    const langCode = this.translationService.currentLang;
    switch (statusId) {
      case 1:
        return langCode === 'UA' ? 'Надіслано викладачу' : 'Given to the teacher';
      case 2:
        return langCode === 'UA' ? 'Не надіслано викладачу' : 'Not given to the teacher';
      case 3:
        return langCode === 'UA' ? 'Не захищено' : 'Not protected';
      case 4:
        return langCode === 'UA' ? 'Виконано' : 'Done';
      default:
        return 'Unknown';
    }
  }

   popoverConfig: PopoverConfig = new PopoverConfig();

    getTooltip(entryId: number, date: Date): string {
    const assignment = this.assignments.find(a => a.entryId === entryId);
    if (!assignment) {
      return '';
    }
    return `${assignment.name} - ${this.translationService.translate(assignment.discipline?.name)}`;
  }

  openGradeDetail(studentId: number, date: Date) {
    const assignment = this.assignments.find(a => a.studentId === studentId && new Date(a.gradeDate).toDateString() === new Date(date).toDateString());
    console.log(assignment);
    if (!assignment) {
      return;
    }

    if (assignment.grade != -999) {
      const statusText = this.getStatusText(assignment['statusId']);
      const dueDateColor = new Date(assignment.dueDate) < new Date(assignment.gradeDate) ? 'red' : 'green';

      this.dialog.open(GradeDetailPopupComponent, {
        width: '600px',
        data: {
          assignment,
          statusText,
          dueDateColor
        }
      });
    }
    else {
      this.openGradePopup(assignment, true);
    }
  }

  openFullscreen() {
    this.dialog.open(FullscreenGradeTableComponent, {
      width: '99vw',
      height: '95vh',
      data: {
        uniqueDisciplines: this.uniqueDisciplines,
        uniqueDates: this.uniqueDates,
        assignments: this.assignments
      }
    });
  }

   openGradePopup(assignment: Assignment, gridMode: boolean = false): void {
    const dialogRef = this.dialog.open(GradeStudentPopup, {
      width: '600px',
      data: { assignment: assignment, gridMode: gridMode }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadToCheckAssignments();
    });
  }

  openToDoAssignment(assignment) {
    if (assignment.assignmentDetails.length === 0) {
      this.snackBar.open(this.translationService.translate('lblNoDataForAssignment'), this.translationService.translate('lblClose'), { duration: 3000 });
      return;
    }
    this.dialog.open(TodDoAssignmentsPopupComponent, {
      width: '85vw',
      data: {
        assignment: assignment
      }
    });
  }

  loadGrid() {
    const teacherId = this.userService.getUser()['teacher'].entryId;
    const formattedDateFrom = this.dateFrom.toISOString();
    const formattedDateTo = this.dateTo.toISOString();

    console.log(this.selectedDiscipline);
    console.log(this.selectedGroup);

    this.assignmentService.getGridForTeacher(teacherId, {
      dateFrom: formattedDateFrom,
      dateTo: formattedDateTo,
      disciplineId: this.selectedDiscipline ? this.selectedDiscipline.entryId : null,
      groupId: this.selectedGroup ? this.selectedGroup.entryId : null
    }).subscribe(data => {
      console.log(data);
      this.assignments = data;
      this.uniqueDates = this.getUniqueDates(data);
      this.uniqueStudents = this.getUniqueStudents(data);
    });
  }

  getUniqueDates(assignments: Assignment[]): string[] {
    const dates = assignments.map(a => a.gradeDate ? new Date(a.gradeDate).toISOString().split('T')[0] : '');
    return [...new Set(dates)].sort();
  }

  getUniqueStudents(assignments: Assignment[]): any[] {
    // Implement logic to get unique students based on assignments
    // Example:
    const students = assignments.map(a => a.student);
    return [...new Set(students.map(s => s.entryId))].map(id => students.find(s => s.entryId === id));
  }

  getGrade(studentId: number, date: string): number | null {
    const assignment = this.assignments.find(a => a.studentId === studentId && new Date(a.gradeDate).toISOString().split('T')[0] === date);
    return assignment ? assignment.grade : null;
  }

}
