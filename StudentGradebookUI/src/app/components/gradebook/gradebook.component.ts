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

@Component({
  selector: 'app-gradebook',
  templateUrl: './gradebook.component.html',
  styleUrls: ['./gradebook.component.scss']
})
export class GradebookComponent implements OnInit {

  constructor(private translationService: TranslationService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

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

  FormatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  activeTabIndex: number = 0;
    onTabChange(index: number): void {
      console.log(index);
      this.activeTabIndex = index;
      if (this.activeTabIndex === 0) {
        console.log('a");')
        this.loadTodoAssignments();
      }
    }

  loadTodoAssignments() {
     const studentID = this.userService.getUser()['student'].entryId;
     this.assignmentService.getToDoAssignmentsForStudent(studentID).subscribe(data => {
      console.log(data);
      this.todoAssignments = data;
    });
  }

  ngOnInit(): void {
     this.semesters = this.translationService.currentLang === 'EN' ? this.semestersEN : this.semestersUA;
     this.selectedSemester = this.semesters[7];
     this.popoverConfig.container = 'body'; // To append to the body instead of the component
    this.onSemesterChange(this.selectedSemester);
    this.loadTodoAssignments();
  }

  dateFrom: Date;
  dateTo: Date;
  uniqueDisciplines: any[] = [];
  uniqueDates: any[] = [];
  assignments: Assignment[] = [];
  todoAssignments: Assignment[] = [];

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


    const studentID = this.userService.getUser()['student'].entryId;

    this.assignmentService.getAssignmentsForStudent(studentID, {
      dateFrom: this.dateFrom.toISOString(),
      dateTo: this.dateTo.toISOString(),
      disciplineIds: []
    }).subscribe(data => {
      this.assignments = data;
      this.processData();
    });
  }

   processData() {
    this.uniqueDisciplines = this.getUniqueDisciplines(this.assignments);
    this.uniqueDates = this.getUniqueDates(this.assignments);
  }

  getUniqueDisciplines(assignments: Assignment[]): any[] {
    const disciplinesMap = {};
    assignments.forEach(assignment => {
      if (assignment.discipline) {
        disciplinesMap[assignment.discipline.entryId] = assignment.discipline;
      }
    });
    return Object.values(disciplinesMap);
  }

  getUniqueDates(assignments: Assignment[]): any[] {
    const datesSet = new Set<string>();
    assignments.forEach(assignment => {
      if (assignment.gradeDate) {
        datesSet.add(new Date(assignment.gradeDate).toDateString());
      }
    });
    return Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  getGrade(disciplineId: number, date: string): number | null {
    const assignment = this.assignments.find(a =>
      a.disciplineId === disciplineId && new Date(a.gradeDate).toDateString() === date
    );

    return assignment ? assignment.grade : null;
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

  openGradeDetail(disciplineId: number, date: Date) {
    const assignment = this.assignments.find(a => a.disciplineId === disciplineId && new Date(a.gradeDate).toDateString() === new Date(date).toDateString());
    if (!assignment) {
      return;
    }

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

  openToDoAssignment(assignment) {
    this.dialog.open(TodDoAssignmentsPopupComponent, {
      width: '600px',
      data: {
        assignment: assignment
      }
    });
  }

}
