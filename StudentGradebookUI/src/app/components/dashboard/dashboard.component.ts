import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { DashboardInfoComponent } from '../dashboard-info/dashboard-info.component';
import { GradebookComponent } from '../gradebook/gradebook.component';
import { UserProfileComponent } from '../userprofile/userprofile.component';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { TeacherAnalyticsComponent } from '../teacher-analytics/teacher-analytics.component';
import { DashboardInfoTeacherComponent } from 'src/app/dashboard-info-teacher/dashboard-info-teacher.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedOption: string | null = null;
  selectedComponent: any = null;

  currentUser: any;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    public translationService: TranslationService
  ) {}

   ngOnInit() {
    this.currentUser = this.userService.getUser();
    this.selectedOption = 'dashboard-info';
    this.selectedComponent = this.currentUser['role'] === 1 ? DashboardInfoComponent : DashboardInfoTeacherComponent;
    console.log(this.currentUser);
  }

  onSelectOption(option: string): void {
    this.selectedOption = option;

    switch (option) {
      case "dashboard-info": {
        this.selectedComponent = this.currentUser['role'] === 1 ? DashboardInfoComponent : DashboardInfoTeacherComponent;
        break;
      }
      case "gradebook": {
        this.selectedComponent = GradebookComponent;
        break;
      }
      case "user-profile": {
        this.selectedComponent = UserProfileComponent;
        break;
      }
      case "analytics": {
        this.selectedComponent = this.currentUser['role'] === 1 ? AnalyticsComponent : TeacherAnalyticsComponent;
        break;
      }
    }
  }

  setLanguage(lang: string) {
    this.translationService.setCurrentLanguage(lang);
  }

  logout(): void {
    this.authService.logout();
  }
}
