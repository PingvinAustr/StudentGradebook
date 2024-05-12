import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexNoData
} from "ng-apexcharts";
import { UserService } from 'src/app/services/user/user-service.service';
import { DisciplineService } from 'src/app/services/disciplines.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { Assignment } from 'src/app/models/assignment.model';
import { ChartOptions, DonutChartOptions, TimeLineChartOptions } from 'src/assets/charts.options';
import { SemesterScheduleServiceService } from 'src/app/services/semester-control/semester-schedule-service.service';

@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss']
})
export class DashboardInfoComponent implements OnInit {
  constructor(private assignmentService: AssignmentService, 
    private userService: UserService, 
    private disciplineService:DisciplineService,
    private translationService: TranslationService,
    private semesterControlScheduleService: SemesterScheduleServiceService) { }

  currentUserName: string;
  ngOnInit(): void {
    this.defineCurrentUserLabel();
    this.formatCurrentDate();
    this.loadRecentGradesForStudent();
    this.loadDueDateThisWeekAssignmentsForStudent();
    this.loadAssignmentsStats();
    this.loadSemesterScheduleForStudent();
  }


  formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formattedDate: string;
  private formatCurrentDate(): void {
    const now = new Date();

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const dayOfWeek = days[ now.getDay() ];
    let monthName = month[now.getMonth()];

    const dayOfMonth = now.getDate();
    console.log(dayOfWeek);
    console.log(monthName);
    const monthNameLocalized = this.translationService.translate(`lbl${monthName}L`);
    this.formattedDate = `${this.translationService.translate(`lbl${dayOfWeek}`)}, ${dayOfMonth} ${monthNameLocalized}`;
  }

  defineCurrentUserLabel() {
    const user = this.userService.getUser();
    const isStudent = user['role'] === 1;
    this.currentUserName = isStudent ? user['student']['firstName'] : user['teacher']['firstName'];
  }

  recentAssignmentsForStudent: Assignment[];
  visibleAssignments: Assignment[] = [];
  visibleCount: number = 4;
  loadRecentGradesForStudent() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] !== 1) return;

    const studentID = currentUser['student']['entryId'];
    this.assignmentService.getAllAssignmentsForStudent(studentID)
    .subscribe(data => {
      this.recentAssignmentsForStudent = data;
      this.updateVisibleAssignments();
    });
  }

  IsShowMoreButtonVisibleForNewGrades: boolean = true;
  IsHideAllButtonVisibleForNewGrades: boolean = false;
  showMore() {
    this.visibleCount = Math.min(this.recentAssignmentsForStudent.length, this.visibleCount + 4);
    this.updateVisibleAssignments();
    if (this.visibleCount >= 16) this.IsShowMoreButtonVisibleForNewGrades = false;
    this.IsHideAllButtonVisibleForNewGrades = true;
  }

  hideAllNewGrades() {
    this.visibleAssignments = this.recentAssignmentsForStudent.slice(0, 4);
    this.IsHideAllButtonVisibleForNewGrades = false;
    this.visibleCount = 4;
    this.IsShowMoreButtonVisibleForNewGrades = true;
  }

  updateVisibleAssignments() {
    this.visibleAssignments = this.recentAssignmentsForStudent.slice(0, this.visibleCount);
  }


  dueDateThisWeekAssignments: Assignment[];
  visibleDueDateAssignments: Assignment[] = [];
  visibleDueDateCount: number = 4;
  IsShowMoreButtonVisibleForDueDate: boolean = true;
  IsHideAllButtonVisibleForDueDate: boolean = false;
  loadDueDateThisWeekAssignmentsForStudent() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] !== 1) return;

    const studentID = currentUser['student']['entryId'];
    this.assignmentService.getDueDateThisWeekAssignmentsForStudent(studentID)
    .subscribe(data => {
      this.dueDateThisWeekAssignments = data;
      this.updateVisibleDueDateAssignments();
    });
  }

  showMoreDueDateGrades() {
    this.visibleDueDateCount = Math.min(this.dueDateThisWeekAssignments.length, this.visibleDueDateCount + 4);
    this.updateVisibleDueDateAssignments();
    if (this.visibleDueDateCount >= 16) this.IsShowMoreButtonVisibleForDueDate = false;
    this.IsHideAllButtonVisibleForDueDate = true;
  }

  hideAllDueDateGrades() {
    console.log(this.dueDateThisWeekAssignments);
    this.visibleDueDateAssignments = this.dueDateThisWeekAssignments.slice(0, 4);
    console.log(this.visibleDueDateAssignments);
    this.IsHideAllButtonVisibleForDueDate = false;
    this.visibleDueDateCount = 4;
  }

  updateVisibleDueDateAssignments() {
    this.visibleDueDateAssignments = this.dueDateThisWeekAssignments.slice(0, this.visibleDueDateCount);
  }

  loadAssignmentsStats() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] !== 1) return;

    let allAssignmentsForStudent: Assignment[];
    const studentID = currentUser['student']['entryId'];
    this.assignmentService.getAllAssignmentsForStudent(studentID)
    .subscribe(data => {
      allAssignmentsForStudent= data;
      console.log(data);
      this.initStudentDountDiagram(allAssignmentsForStudent);
    });
  }


  getAssignmentStatusNameById(id) {
    if (id === 1) return this.translationService.translate('lblStatusId1');
    if (id === 2) return this.translationService.translate('lblStatusId2');
    if (id === 3) return this.translationService.translate('lblStatusId3');
    if (id === 4) return this.translationService.translate('lblStatusId4');
  }

  donutChartOptions: DonutChartOptions;
  initStudentDountDiagram(allAssignmentsForStudent) {

    const statusCounts = new Map<number, number>();
    const statusNames = new Map<number, string>();

    // Collect counts per statusId and map status names
    allAssignmentsForStudent.forEach(assignment => {
      statusCounts.set(assignment.statusId, (statusCounts.get(assignment.statusId) || 0) + 1);
      statusNames.set(assignment.statusId, this.getAssignmentStatusNameById(assignment.statusId));
    });

    // Prepare series and labels
    const series: number[] = [];
    const labels: string[] = [];

    statusCounts.forEach((count, statusId) => {
      series.push(count);
      labels.push(statusNames.get(statusId) || 'Unknown Status');
    });

    this.donutChartOptions = {
      series: series,
      chart: {
        width: 354,
        type: "donut",
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 5,
            size: "50%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }},
      colors: ["#FF4560", "#00E396", "#FEB019", "#775DD0", "#008FFB"],
    };
  }



  loadSemesterScheduleForStudent() {
    const currentUser = this.userService.getUser();
    if (currentUser['role'] !== 1) return;

    const studentID = currentUser['student']['entryId'];
    this.semesterControlScheduleService.getSemesterControlScheduleForStudent(studentID)
    .subscribe(data => {
      console.log(data);
      this.initStudentTimeLine(data);
    });
  }

  timelineChartOptions: TimeLineChartOptions;
  initStudentTimeLine(scheduleEntries) {
  const daysLabel = this.translationService.translate('lblDays');
  const dayLabel = this.translationService.translate('lblDay');

  const translationServ = this.translationService;
   const colors = ["#008FFB", "#00E396", "#775DD0", "#FEB019", "#FF4560"]; 
    this.timelineChartOptions = {
      series: [{
        data: scheduleEntries.map((entry, index) => ({
          x: translationServ.translate(entry.controlType.name),
          y: [
            new Date(entry.startDate).getTime(),
            new Date(entry.endDate).getTime()
          ],
          fillColor: colors[index % colors.length] // Cycle through colors
        }))
      }],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val, opts) {
          var label = opts.w.globals.labels[opts.dataPointIndex];
          var a = new Date(val[0]);
          var b = new Date(val[1]);
          var diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
          return label + ": " + diff + (diff > 1 ? daysLabel : dayLabel);
        },
        style: {
          colors: ["#f3f4f5", "#fff"]
        }
      },
      xaxis: {
       type: "datetime",
        labels: {
          format: 'dd MMM', 
          formatter: (value) => this.formatDateLocalization(value),
        }
      },
      yaxis: {
        show: false
      },
      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 1
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy',
        },
        enabled: false
      },
    };
  }

   formatDateLocalization(value): string {

     const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const date = new Date(value);
    const month = date.getMonth();
    const day = date.getDate();
    const localizedMonth = this.translationService.translate(`lbl${months[month]}`);
    return `${day} ${localizedMonth}`;
  }
}
