import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslationService } from '../translation/translation-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Authentication`;
  public translationService;
  constructor(private http: HttpClient, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private injector: Injector) { 
       setTimeout(() => this.translationService = this.injector.get(TranslationService), 0);
    }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token); // Store JWT separately for easier access
        localStorage.setItem('user', JSON.stringify(response)); // Storing the rest of the user details
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.snackBar.open(this.translationService.translate('lblLoggedOutSuccess'), this.translationService.translate('lblClose'), { duration: 3000 });
  }

  getToken(): string {
    return localStorage.getItem('jwtToken') || '';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Here you might want to check if the token is expired using a library like jwt-decode
  }

  registerStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/student`, student);
  }

  registerTeacher(teacher: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/teacher`, teacher);
  }
}
