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
  ApexNoData,
  ApexOptions,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexFill,
  ApexResponsive,
  ApexGrid,
  ApexLegend
} from "ng-apexcharts";

import { Assignment } from 'src/app/models/assignment.model';
import { UserService } from 'src/app/services/user/user-service.service';
import { Discipline } from 'src/app/models/discipline.model';
import { DisciplineService } from 'src/app/services/disciplines.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { BarChartOptions, ChartOptions, HeatMapOptions, PolarChartOptions } from 'src/assets/charts.options';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})

export class AnalyticsComponent implements OnInit {
  generalTabChartOptions: Partial<ChartOptions>;
  generalTabAssignments: Assignment[];
  generalTabDateFrom: Date;
  generalTabDateTo: Date;
  generalTabSelectedDisciplines: Discipline[] = [];

  polarChartOptions: Partial<PolarChartOptions>;
  polarAssignments: Assignment[];

  notCheckedAssignments: Assignment[];
  notCheckedAssignmentsChartOptions: Partial<BarChartOptions>;

  heatMapChartOptions: Partial<HeatMapOptions>;

  public disciplines: Discipline[] = [];
  constructor(private assignmentService: AssignmentService, 
    private userService: UserService, 
    private disciplineService:DisciplineService,
    private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initDefaultFilterValues();
    this.loadGeneralTabAssignments();
    this.loadPolarTabAssignments();
    this.loadDisciplines();
  }

   activeTabIndex: number = 0;
   onTabChange(index: number): void {
    this.activeTabIndex = index;
    if (index === 0) {
      this.loadGeneralTabAssignments(); 
    } else if (index === 1) {
      this.loadPolarTabAssignments();
    } else if (index === 2) {
      this.loadNotCheckedAssignments();
    } else if (index === 3) {
      this.loadHeatMapAssignments();
    }
  }


  initDefaultFilterValues(): void {
    // General tab
    const today = new Date();
    const oneMonthLater = new Date(new Date().setMonth(today.getMonth() + 1));
    this.generalTabDateFrom = today;
    this.generalTabDateTo = oneMonthLater;
  }

  loadDisciplines(): void {
    this.disciplineService.getDisciplines().subscribe(disciplines => {
      this.disciplines = disciplines;
    });
  }

  setDatesBasedOnSemester() {
    const startDate = this.selectedSemester === 1 ? `${this.selectedYear}-09-01` : `${this.selectedYear + 1}-01-25`;
    const endDate = this.selectedSemester === 1 ? `${this.selectedYear}-12-31` : `${this.selectedYear + 1}-06-10`;
    this.generalTabDateFrom = new Date(startDate);
    this.generalTabDateTo = new Date(endDate);
  }

  loadGeneralTabAssignments(): void {
    if (!this.useDateRange) this.setDatesBasedOnSemester();
    const studentID = this.userService.getUser()['student'].entryId;
    const formattedDateFrom = this.generalTabDateFrom.toISOString();
    const formattedDateTo = this.generalTabDateTo.toISOString();

    console.log(formattedDateFrom);
    console.log(formattedDateTo);
    console.log(studentID);
    console.log(this.generalTabSelectedDisciplines);

    this.assignmentService.getAssignmentsForStudent(studentID, {
      dateFrom: formattedDateFrom,
      dateTo: formattedDateTo,
      disciplineIds: this.generalTabSelectedDisciplines
    }).subscribe(data => {
      console.log(data);
      this.generalTabAssignments = data;
      this.initGeneralGradesChart();
    });
  }


  loadNotCheckedAssignments(): void {
    const studentID = this.userService.getUser()['student'].entryId;
    this.assignmentService.getNotCheckedAssignmentsForStudent(studentID).subscribe(assignments => {
      this.notCheckedAssignments = assignments;
      this.initNotCheckedAssignmentsChart();
    });
  }

  loadHeatMapAssignments(): void {
    this.initHeatMapChart();
  }

  generateHeatMapSeries(): any {
    const studentID = this.userService.getUser()['student'].entryId;
    let seriesArray: any[] = [];
    console.log(this.disciplines);
    // Iterate through each discipline to prepare the data for the heatmap
    this.disciplines.forEach(discipline => {
        let seriesEntry = {
            name: discipline.name,
            data: []
        };

        // Filter and map the assignments for the current discipline
        discipline.assignments.forEach(assignment => {
            if (assignment.studentId === studentID && assignment.gradeDate) {
                // Assuming each assignment has a 'gradeDate' and 'grade' field
                seriesEntry.data.push({
                    x: new Date(assignment.gradeDate).toLocaleDateString(),
                    y: assignment.grade
                });
            }
        });

        // Add the series entry to the series array if it contains any data
        if (seriesEntry.data.length > 0) {
            seriesArray.push(seriesEntry);
        }
    });

    console.log(seriesArray);
    return seriesArray;
}


  initHeatMapChart(): void {
    const series = this.generateHeatMapSeries()
     this.heatMapChartOptions = {
      series: series,
      chart: {
        height: `${series.length * 75}px`,
        type: "heatmap"
      },
      stroke: {
        width: 0
      },
      plotOptions: {
        heatmap: {
          radius: series.length * 30,
          enableShades: false,
          colorScale: {
            ranges: [
              {
                from: 1,
                to: 59,
                color: "#d13d1f"
              },
              {
                from: 60,
                to: 74,
                color: "#d19c1f"
              },
              {
                from: 75,
                to: 89,
                color: "#add11f"
              },
              {
                from: 90,
                to: 100,
                color: "#00e339"
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"]
        }
      },
      xaxis: {
        type: "category"
      },
    };
  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  initNotCheckedAssignmentsChart(): void {
    const disciplineData = this.notCheckedAssignments.reduce((acc, curr) => {
      const name = curr.discipline.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

     this.notCheckedAssignmentsChartOptions = {
      series: [
        {
          name: this.translationService.translate('lblUngradedTasksQuantity'),
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

  useDateRange = false;
  availableYears = [2022, 2023, 2024];
  semesters = [{ id: 1, name: this.translationService.translate('lblFirstSemester') }, { id: 2, name: this.translationService.translate('lblSecondSemester') }];
  selectedYear: number;
  selectedSemester: number;

  toggleDateUsage() {
    this.useDateRange = !this.useDateRange;
  }

  loadPolarTabAssignments(): void {
    const studentID = this.userService.getUser()['student'].entryId;

    this.assignmentService.getAllAssignmentsForStudent(studentID)
    .subscribe(data => {
      this.generalTabAssignments = data;
      this.initPolarChart(data);
    });
  }


 initPolarChart(assignments: any[]): void {
  console.log(assignments);
    const disciplineCounts = assignments.reduce((acc, curr) => {
      const name = curr.discipline.name;
      if (acc[name]) {
        acc[name]++;
      } else {
        acc[name] = 1;
      }
      return acc;
    }, {});

    this.polarChartOptions = {
      series: Object.values(disciplineCounts), 
      labels: Object.keys(disciplineCounts), 
      chart: {
        type: "polarArea",
        height: '400px' 
      },
      stroke: {
        colors: ["#fff"]
      },
      fill: {
        opacity: 0.8
      },
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
      ]
    };
  }

initGeneralGradesChart(): void {
  const seriesMap = new Map<number, { name: string, data: any[] }>();
  this.generalTabAssignments.forEach(assignment => {
    if (assignment.discipline && assignment.gradeDate) {
      if (!seriesMap.has(assignment.disciplineId)) {
        seriesMap.set(assignment.disciplineId, {
          name: assignment.discipline.name,
          data: []
        });
      }

      const series = seriesMap.get(assignment.disciplineId);
      series.data.push({
        x: new Date(assignment.gradeDate + 'Z').toISOString(),  // Ensure UTC date
        y: assignment.grade
      });
    }
  });

  this.generalTabChartOptions = {
    series: Array.from(seriesMap.values()),
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: true },
      locales: [{
          name: 'en',
          options: {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            toolbar: {
              download: 'Download SVG',
              selection: 'Selection',
              selectionZoom: 'Selection Zoom',
              zoomIn: 'Zoom In',
              zoomOut: 'Zoom Out',
              pan: 'Panning',
              reset: 'Reset Zoom'
            }
          }
        }, {
          name: 'ua',
          options: {
            months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
            shortMonths: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
            days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
            shortDays: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            toolbar: {
              download: 'Завантажити SVG',
              selection: 'Вибір',
              selectionZoom: 'Збільшення вибору',
              zoomIn: 'Збільшити',
              zoomOut: 'Зменшити',
              pan: 'Панорамування',
              reset: 'Скинути збільшення'
            }
          }
        }],
        defaultLocale: this.translationService.getCurrentLanguage() === 'UA' ? 'ua' : 'en'
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 10,
      labels: {
        datetimeUTC: false,  // Make sure the chart doesn't convert dates to UTC
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    yaxis: {
      title: { text: 'Grades' },
      min: 0,
      max: 100
    },
    noData: { text: 'Loading...' }
  };
}


}
