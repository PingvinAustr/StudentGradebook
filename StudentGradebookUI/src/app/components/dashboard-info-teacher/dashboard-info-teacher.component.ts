import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../services/assignments/assignment-service.service';
import { DisciplineService } from '../../services/disciplines/disciplines.service';
import { TranslationService } from '../../services/translation/translation-service.service';
import { UserService } from '../../services/user/user-service.service';
import { Assignment } from '../../models/assignment.model';
import { TeacherChartOptions } from 'src/assets/charts.options';

@Component({
  selector: 'app-dashboard-info-teacher',
  templateUrl: './dashboard-info-teacher.component.html',
  styleUrl: './dashboard-info-teacher.component.scss'
})
export class DashboardInfoTeacherComponent implements OnInit {
  constructor(private assignmentService: AssignmentService, 
    private userService: UserService, 
    private disciplineService:DisciplineService,
    private translationService: TranslationService) { }


    currentUserName: string;
    ngOnInit(): void {
      this.defineCurrentUserLabel();
      this.formatCurrentDate();
      this.loadUngradedAssignmentsForTeacher();
      this.loadrecentCheckedAssignmentsForTeacher();
      this.loadLineChart();
    }

  formattedDate: string;
  private formatCurrentDate(): void {
    const now = new Date();

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const dayOfWeek = days[ now.getDay() ];
    let monthName = month[now.getMonth()];

    const dayOfMonth = now.getDate();
    const monthNameLocalized = this.translationService.translate(`lbl${monthName}L`);
    this.formattedDate = `${this.translationService.translate(`lbl${dayOfWeek}`)}, ${dayOfMonth} ${monthNameLocalized}`;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  defineCurrentUserLabel() {
    const user = this.userService.getUser();
    const isStudent = user['role'] === 1;
    this.currentUserName = isStudent ? user['student']['firstName'] : user['teacher']['firstName'];
  }

  ungradedAssignmentsForTeacher: Assignment[];
  visibleUngradedAssignments: Assignment[] = [];
  visibleUngradedCount: number = 4;
  loadUngradedAssignmentsForTeacher() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] === 1) return;

    const teacherId = currentUser['teacher']['entryId'];
    this.assignmentService.getUngradedAssignmentsForTeacher(teacherId)
    .subscribe(data => {
      this.ungradedAssignmentsForTeacher = data;
      this.updateVisibleUngradedAssignments();
    });
  }

  IsShowMoreButtonVisibleForUngraded: boolean = true;
  IsHideAllButtonVisibleForNewUngraded: boolean = false;
  showMoreUngraded() {
    this.visibleUngradedCount = Math.min(this.ungradedAssignmentsForTeacher.length, this.visibleUngradedCount + 4);
    this.updateVisibleUngradedAssignments();
    if (this.visibleUngradedCount >= 8) this.IsShowMoreButtonVisibleForUngraded = false;
    this.IsHideAllButtonVisibleForNewUngraded = true;
  }

  hideAllUngraded() {
    this.visibleUngradedAssignments = this.ungradedAssignmentsForTeacher.slice(0, 4);
    this.IsHideAllButtonVisibleForNewUngraded = false;
    this.visibleUngradedCount = 4;
    this.IsShowMoreButtonVisibleForUngraded = true;
  }

  updateVisibleUngradedAssignments() {
    this.visibleUngradedAssignments = this.ungradedAssignmentsForTeacher.slice(0, this.visibleUngradedCount);
  }

  // RECENT GRADES
  recentCheckedAssignmentsForTeacher: Assignment[];
  visiblerecentCheckedAssignments: Assignment[] = [];
  visiblerecentCheckedCount: number = 4;
  loadrecentCheckedAssignmentsForTeacher() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] === 1) return;

    const teacherId = currentUser['teacher']['entryId'];
    this.assignmentService.getRecentCheckedGradesByTeacher(teacherId)
    .subscribe(data => {
      this.recentCheckedAssignmentsForTeacher = data;
      this.updateVisibleRecentCheckedAssignments();
    });
  }

  IsShowMoreButtonVisibleForRecentChecked: boolean = true;
  IsHideAllButtonVisibleForRecentChecked: boolean = false;
  showMoreRecentChecked() {
    this.visiblerecentCheckedCount = Math.min(this.recentCheckedAssignmentsForTeacher.length, this.visiblerecentCheckedCount + 4);
    this.updateVisibleRecentCheckedAssignments();
    if (this.visiblerecentCheckedCount >= 8) this.IsShowMoreButtonVisibleForRecentChecked = false;
    this.IsHideAllButtonVisibleForRecentChecked = true;
  }

  hideAllRecentChecked() {
    this.visiblerecentCheckedAssignments = this.recentCheckedAssignmentsForTeacher.slice(0, 4);
    this.IsHideAllButtonVisibleForRecentChecked = false;
    this.visiblerecentCheckedCount = 4;
    this.IsShowMoreButtonVisibleForRecentChecked = true;
  }

  updateVisibleRecentCheckedAssignments() {
    this.visiblerecentCheckedAssignments = this.recentCheckedAssignmentsForTeacher.slice(0, this.visiblerecentCheckedCount);
  }

  lineChartOptions: TeacherChartOptions;

  loadLineChart() {
    const teacherId = this.userService.getUser()['teacher'].entryId;
      this.assignmentService.getAllAssignmentsForTeacher(teacherId).subscribe(data => {
        this.initLineChart(data);
      });
  }

  initLineChart(assignments: Assignment[]) {
    const months = Array.from({ length: 12 }, (_, i) => this.translationService.translate(`lbl${new Date(0, i).toLocaleString('en', { month: 'long' })}`));
    const assignmentsByMonth = new Array(12).fill(0); // Array to count assignments per month

    assignments.forEach(assignment => {
      if (assignment.gradeDate) {
        const month = new Date(assignment.gradeDate).getMonth(); // getMonth is zero-indexed
        assignmentsByMonth[month]++;
      }
    });

    this.lineChartOptions = {
      series: [
        {
          name: this.translationService.translate('lblAssignmentsCount'),
          data: assignmentsByMonth
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: this.translationService.translate('lblAssignmentsCountTitle'),
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: months
      }
    };
  }

}
