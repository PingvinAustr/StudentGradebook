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

@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss']
})
export class DashboardInfoComponent implements OnInit {
  constructor(private assignmentService: AssignmentService, 
    private userService: UserService, 
    private disciplineService:DisciplineService,
    private translationService: TranslationService) { }

  currentUserName: string;
  ngOnInit(): void {
    const user = this.userService.getUser();
    const isStudent = user['role'] === 1;
    console.log(user);
    this.currentUserName = isStudent ? user['student']['firstName'] : user['teacher']['firstName'];
    console.log(this.currentUserName);
    this.formatCurrentDate();
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
    const monthNameLocalized = this.translationService.translate(`lbl${monthName}`);
    this.formattedDate = `${this.translationService.translate(`lbl${dayOfWeek}`)}, ${dayOfMonth} ${monthNameLocalized}`;
  }

}
