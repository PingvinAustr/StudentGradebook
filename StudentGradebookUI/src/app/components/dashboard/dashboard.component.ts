import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user-service.service';
import { DashboardInfoComponent } from '../dashboard-info/dashboard-info.component';
import { GradebookComponent } from '../gradebook/gradebook.component';
import { UserProfileComponent } from '../userprofile/userprofile.component';

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
    private userService: UserService
  ) {}

   ngOnInit() {
    this.currentUser = this.userService.getUser();
    this.selectedOption = 'dashboard-info';
    this.selectedComponent = DashboardInfoComponent;
    console.log(this.currentUser);
  }

  onSelectOption(option: string): void {
    this.selectedOption = option;

    switch (option) {
      case "dashboard-info": {
        this.selectedComponent = DashboardInfoComponent;
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
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
