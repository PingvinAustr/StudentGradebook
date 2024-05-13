import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from '../../models/discipline.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private apiUrl = `${environment.apiUrl}/Disciplines`;
  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService, private authService: AuthService) { }

  headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
  });

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getDisciplinesByTeacher(teacherId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/ByTeacher/${teacherId}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
}
