import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SemesterScheduleServiceService {

  private apiUrl = `${environment.apiUrl}/SemesterControlSchedules`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) { }

  getSemesterControlScheduleForStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/SemesterScheduleForStudent/${studentId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

}
