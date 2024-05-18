import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './components/app-component/app.component';
import { CafedraService } from './services/cafedra/cafedra.service';
import { AuthService } from './services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { GroupService } from './services/group/group.service';
import { TranslationService } from './services/translation/translation-service.service';
import { AssignmentService } from './services/assignments/assignment-service.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { JWTInterceptorInterceptor } from './interceptors/jwt/jwtinterceptor.interceptor';
import { DashboardInfoComponent } from './components/dashboard-info/dashboard-info.component';
import { GradebookComponent } from './components/gradebook/gradebook.component';
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from './pipes/translation/translation-pipe.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DisciplineService } from './services/disciplines/disciplines.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TeacherAnalyticsComponent } from './components/teacher-analytics/teacher-analytics.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import { DashboardInfoTeacherComponent } from './components/dashboard-info-teacher/dashboard-info-teacher.component';
import { SemesterScheduleServiceService } from './services/semester-control/semester-schedule-service.service';
import { SignalRService } from './services/signal-r/signal-r.service';
import { ErrorPageComponent } from './components/error/error-page.component';
import { ErrorHandlingService } from './services/error-handling/error-handling.service';
import { ThemeService } from './services/theme/theme.service';
import { LoadingService } from './services/loading/loading.service';
import { LoadingInterceptor } from './interceptors/loading/loading.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export function initApp(translationService: TranslationService) {
  return () => {
    const lang = localStorage.getItem('appLang') || 'UA'; 
    return translationService.loadTranslations(lang).toPromise();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationFormComponent,
    AnalyticsComponent,
    TeacherAnalyticsComponent,
    DashboardComponent,
    DashboardInfoComponent,
    DashboardInfoTeacherComponent,
    GradebookComponent,
    UserProfileComponent,
    PageNotFoundComponent,
    ErrorPageComponent,
    TranslatePipe
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatPasswordStrengthModule,
    MatCheckboxModule,
    NgApexchartsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],

  providers: [
    CafedraService,
    AuthService,
    GroupService,
    LoadingService,
    TranslationService,
    AssignmentService,
    DisciplineService,
    SignalRService,
    ThemeService,
    ErrorHandlingService,
    SemesterScheduleServiceService,
     { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptorInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
     {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [TranslationService],
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
