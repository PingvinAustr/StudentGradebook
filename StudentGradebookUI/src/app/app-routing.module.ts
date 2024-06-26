import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TeacherAnalyticsComponent } from './components/teacher-analytics/teacher-analytics.component';
import { DashboardInfoTeacherComponent } from './components/dashboard-info-teacher/dashboard-info-teacher.component';
import { ErrorPageComponent } from './components/error/error-page.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirects to login by default
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'teacher-analytics', component: TeacherAnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'teacher-dashboardinfo', component: DashboardInfoTeacherComponent, canActivate: [AuthGuard] },
  { path: 'error-page', component: ErrorPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
