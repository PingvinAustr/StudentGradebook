import { Component } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { Discipline } from 'src/app/models/discipline.model';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import { DisciplineService } from 'src/app/services/disciplines/disciplines.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { BarChartOptions, ChartOptions, HeatMapOptions, HorizontalBarChartOptions, PolarChartOptions, RadialChartOptions } from 'src/assets/charts.options';

@Component({
  selector: 'app-teacher-analytics',
  templateUrl: './teacher-analytics.component.html',
  styleUrl: './teacher-analytics.component.scss'
})
export class TeacherAnalyticsComponent {
  constructor(private assignmentService: AssignmentService, 
    private userService: UserService, 
    private disciplineService:DisciplineService,
    private translationService: TranslationService) { }

    generalTabChartOptions: Partial<BarChartOptions>;
    generalTabAssignments: Assignment[];
    generalTabDateFrom: Date;
    generalTabDateTo: Date;
    generalTabSelectedDisciplines: Discipline[] = [];
    useDateRange: boolean = false;


    horizontalBarChartOptions: Partial<HorizontalBarChartOptions>;

    currentTeacherDisciplines: Discipline[] = [];
    availableYears = [2022, 2023, 2024];
    semesters = [{ id: 1, name: this.translationService.translate('lblFirstSemester') }, { id: 2, name: this.translationService.translate('lblSecondSemester') }];
    selectedYear: number;
    selectedSemester: number;
    activeTabIndex: number = 0;
    onTabChange(index: number): void {
      this.activeTabIndex = index;
      if (index === 0) {
        this.loadGeneralTabAssignments(); 
      }
      else if (index === 1) {
        this.loadHorizontalBarChart();
      }
      else if (index === 2) {
        this.loadRadialChart();
      }
    }

    showOnlyUngradedAssignmentsOnGeneralTab: boolean = false;

    toggleAssignmentsVisibility(): void {
      this.showOnlyUngradedAssignmentsOnGeneralTab = !this.showOnlyUngradedAssignmentsOnGeneralTab;
    }

    radialChartOptions: Partial<RadialChartOptions>;
    radialChartAssignments: Assignment[];
    loadRadialChart() {
      const teacherId = this.userService.getUser()['teacher'].entryId;
      this.assignmentService.getAllAssignmentsForTeacher(teacherId).subscribe(data => {
        console.log(data);
        this.radialChartAssignments = data;
        this.initRadialChart();
      });
    }

    initRadialChart() {
      let percentageGradedByDiscipline: { [key: string]: number } = {};
       const disciplineCounts = this.radialChartAssignments.reduce((acc, assignment) => {
      const disciplineName = assignment.discipline.name;
      if (!acc[disciplineName]) {
        acc[disciplineName] = { graded: 0, total: 0 };
      }
      if (assignment.gradeDate) {
        acc[disciplineName].graded++;
      }
      acc[disciplineName].total++;
      return acc;
    }, {} as { [key: string]: { graded: number; total: number } });

    percentageGradedByDiscipline = Object.keys(disciplineCounts).reduce((acc, discipline) => {
      const { graded, total } = disciplineCounts[discipline];
      acc[discipline] = Math.round((graded / total) * 100);  // Convert to percentage
      return acc;
    }, {} as { [key: string]: number });

      this.radialChartOptions = {
      series: Object.values(percentageGradedByDiscipline),
      chart: {
        height: 500,
        type: "radialBar"
      },
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
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: Object.keys(percentageGradedByDiscipline),
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
    }

    horizontalTabAssignments: Assignment[];
    loadHorizontalBarChart() {
      const teacherId = this.userService.getUser()['teacher'].entryId;
      this.assignmentService.getAllAssignmentsForTeacher(teacherId).subscribe(data => {
        console.log(data);
        this.horizontalTabAssignments = data;
        this.initHorizontalChart();
      });
    }

    initHorizontalChart() {
      let averageGradesByDiscipline: { [key: string]: number } = {};
      let disciplineNames = this.currentTeacherDisciplines.map(discipline => discipline.name);
      console.log(this.horizontalTabAssignments);

      const gradesSumCount = this.horizontalTabAssignments.reduce((acc, assignment) => {
      if (assignment.gradeDate && assignment.grade !== null) {
        if (!acc[assignment.discipline.name]) {
          acc[assignment.discipline.name] = { sum: 0, count: 0 };
        }
        acc[assignment.discipline.name].sum += assignment.grade;
        acc[assignment.discipline.name].count += 1;
      }
      return acc;
    }, {} as { [key: string]: { sum: number; count: number } });

    averageGradesByDiscipline = Object.keys(gradesSumCount).reduce((acc, key) => {
      acc[key] = Math.round(gradesSumCount[key].sum / gradesSumCount[key].count);
      return acc;
    }, {} as { [key: string]: number });

    console.log(averageGradesByDiscipline);



      this.horizontalBarChartOptions = {
      series: [
        {
          name: this.translationService.translate('lblAverageGrade'),
          data: Object.values(averageGradesByDiscipline)
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
        categories: Object.keys(averageGradesByDiscipline)
      }
    };
    }

    ngOnInit(): void {
      this.initDefaultFilterValues();
      this.loadGeneralTabAssignments();
      this.loadCurrentTeacherDisciplines();
    }

    loadCurrentTeacherDisciplines(): void {
      const teacherId = this.userService.getUser()['teacher'].entryId;
      this.disciplineService.getDisciplinesByTeacher(teacherId).subscribe(disciplines => {
        this.currentTeacherDisciplines = disciplines;
      });
  }

    initDefaultFilterValues(): void {
      // General tab
      const today = new Date();
      const oneMonthLater = new Date(new Date().setMonth(today.getMonth() + 1));
      this.generalTabDateFrom = today;
      this.generalTabDateTo = oneMonthLater;
    }

    loadGeneralTabAssignments(): void {
      if (!this.useDateRange) this.setDatesBasedOnSemester();
      const teacherId = this.userService.getUser()['teacher'].entryId;
      const formattedDateFrom = this.generalTabDateFrom.toISOString();
      const formattedDateTo = this.generalTabDateTo.toISOString();

      this.assignmentService.getAssignmentsForTeacher(teacherId, {
        showOnlyUngraded: this.showOnlyUngradedAssignmentsOnGeneralTab,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
        disciplineIds: this.generalTabSelectedDisciplines
      }).subscribe(data => {
        this.generalTabAssignments = data;
        this.initGeneralGradesChart();
      });
    }

    initGeneralGradesChart(): void {
    const disciplineData = this.generalTabAssignments.reduce((acc, curr) => {
      const name = curr.discipline.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

     this.generalTabChartOptions = {
      series: [
        {
          name: this.translationService.translate('lblAssignmentsQuantity'),
          data: Object.values(disciplineData) as number[]
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: Object.keys(disciplineData),
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      }
    };
  }

      setDatesBasedOnSemester() {
        const startDate = this.selectedSemester === 1 ? `${this.selectedYear}-09-01` : `${this.selectedYear + 1}-01-25`;
        const endDate = this.selectedSemester === 1 ? `${this.selectedYear}-12-31` : `${this.selectedYear + 1}-06-10`;
        this.generalTabDateFrom = new Date(startDate);
        this.generalTabDateTo = new Date(endDate);
      }

    toggleDateUsage() {
      this.useDateRange = !this.useDateRange;
    }


}
