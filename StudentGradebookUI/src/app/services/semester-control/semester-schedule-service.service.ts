import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterScheduleServiceService {
  headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
  });
  private apiUrl = `${environment.apiUrl}/SemesterControlSchedules`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService, private authService: AuthService) { }

  getSemesterControlScheduleForStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/SemesterScheduleForStudent/${studentId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

}
