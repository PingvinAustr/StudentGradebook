import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from 'src/app/models/assignment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/Assignments`;

  constructor(private http: HttpClient) { }

  getAssignmentsForStudent(studentId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForStudent/${studentId}`, { params: filters });
  }

  getAssignmentsForTeacher(teacherId: number, filters: any): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/ForTeacher/${teacherId}`, { params: filters });
  }
  
  getAllAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForStudent/${studentId}`);
  }

  getAllAssignmentsForTeacher(teacherId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/AllForTeacher/${teacherId}`);
  }
  
  getNotCheckedAssignmentsForStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/NotCheckedForStudent/${studentId}`);
  }
  
  getAssignmentsByDisciplines(studentId: number, disciplineIds: number[]): Observable<Assignment[]> {
  const params = {
    disciplineIds: disciplineIds
  };
  return this.http.get<Assignment[]>(`${this.apiUrl}/by-disciplines?studentId=${studentId}`, { params });
}
}
