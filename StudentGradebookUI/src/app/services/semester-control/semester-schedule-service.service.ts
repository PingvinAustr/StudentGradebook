import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SemesterScheduleServiceService {

  private apiUrl = `${environment.apiUrl}/SemesterControlSchedules`;

  constructor(private http: HttpClient) { }

  getSemesterControlScheduleForStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/SemesterScheduleForStudent/${studentId}`);
  }

}
