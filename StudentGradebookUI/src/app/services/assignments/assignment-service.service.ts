import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from 'src/app/models/assignment.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/Assignments`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) { }

  getAssignmentsForStudent(studentId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForStudent/${studentId}`, { params: filters }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getAssignmentsForTeacher(teacherId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForTeacher/${teacherId}`, { params: filters }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  };
  
  getAllAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForStudent/${studentId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getRecentGradesForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/RecentGradesForStudent/${studentId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getDueDateThisWeekAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/DueDateThisWeekForStudent/${studentId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getAllAssignmentsForTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForTeacher/${teacherId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getUngradedAssignmentsForTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/UngradedForTeacher/${teacherId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getRecentCheckedGradesByTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/RecentCheckedGradesByTeacher/${teacherId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
  
  getNotCheckedAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/NotCheckedForStudent/${studentId}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
  
  getAssignmentsByDisciplines(studentId: number, disciplineIds: number[]): Observable<Assignment[]> {
  const params = {
    disciplineIds: disciplineIds
  };
  return this.http.get<Assignment[]>(`${this.apiUrl}/by-disciplines?studentId=${studentId}`, { params }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
}
}
