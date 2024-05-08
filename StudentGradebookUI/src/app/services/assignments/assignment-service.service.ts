import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { environment } from 'src/environments/environment';
import { Assignment } from 'src/app/models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/Assignments`;

  constructor(private http: HttpClient) { }

  getAssignmentsByStudent(studentId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/${studentId}`);
  }

}
