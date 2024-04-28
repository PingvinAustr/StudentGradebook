import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { JWTInterceptorInterceptor } from './interceptors/jwtinterceptor.interceptor';
import { DashboardInfoComponent } from './components/dashboard-info/dashboard-info.component';
import { GradebookComponent } from './components/gradebook/gradebook.component';
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationFormComponent,
    DashboardComponent,
    DashboardInfoComponent,
    GradebookComponent,
    UserProfileComponent
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
    MatTableModule
  ],

  providers: [
    CafedraService,
    AuthService,
    GroupService,
    TranslationService,
     { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptorInterceptor, multi: true },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
