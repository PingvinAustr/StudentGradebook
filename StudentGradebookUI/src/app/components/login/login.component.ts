import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for notifications
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showRegistrationForm = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.snackBar.open('Login Successful', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']); // Navigate upon successful login
      },
      error: (error) => {
        this.snackBar.open('Login Failed', 'Close', { duration: 3000 });
        console.error('Login failed', error);
      }
    });
  }

  toggleForm(): void {
    this.showRegistrationForm = !this.showRegistrationForm;
  }

  handleRegistration(): void {
    this.showRegistrationForm = false;
    this.snackBar.open('Registration Successful', 'Close', { duration: 3000 });
  }
}
