import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from '../models/discipline.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private apiUrl = `${environment.apiUrl}/Disciplines`;

  constructor(private http: HttpClient) { }

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl);
  }

  getDisciplinesByTeacher(teacherId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/ByTeacher/${teacherId}`);
  }
}
