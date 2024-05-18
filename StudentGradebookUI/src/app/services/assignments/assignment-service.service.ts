import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from 'src/app/models/assignment.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/Assignments`;
  headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getToken()
    });
  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService, private authService: AuthService) { }

  getAssignmentsForStudent(studentId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForStudent/${studentId}`, { params: filters, headers: this.headers  }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getAssignmentsForTeacher(teacherId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForTeacher/${teacherId}`, { params: filters, headers: this.headers  }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  };
  
  getAllAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForStudent/${studentId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getRecentGradesForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/RecentGradesForStudent/${studentId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getDueDateThisWeekAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/DueDateThisWeekForStudent/${studentId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getAllAssignmentsForTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForTeacher/${teacherId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getUngradedAssignmentsForTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/UngradedForTeacher/${teacherId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getRecentCheckedGradesByTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/RecentCheckedGradesByTeacher/${teacherId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
  
  getNotCheckedAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/NotCheckedForStudent/${studentId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
  
  getAssignmentsByDisciplines(studentId: number, disciplineIds: number[]): Observable<Assignment[]> {
  const params = {
    disciplineIds: disciplineIds
  };
  return this.http.get<Assignment[]>(`${this.apiUrl}/by-disciplines?studentId=${studentId}`, { params, headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
}
}
