import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cafedra } from '../../models/cafedra.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CafedraService {

  private apiUrl = `${environment.apiUrl}/Cafedra`;
  headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
  });
  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService, private authService: AuthService) { }

  getCafedras(): Observable<Cafedra[]> {
    return this.http.get<Cafedra[]>(this.apiUrl, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getCafedra(id: number): Observable<Cafedra> {
    return this.http.get<Cafedra>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  createCafedra(cafedra: Cafedra): Observable<Cafedra> {
    return this.http.post<Cafedra>(this.apiUrl, cafedra, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  updateCafedra(id: number, cafedra: Cafedra): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cafedra, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  deleteCafedra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
}
