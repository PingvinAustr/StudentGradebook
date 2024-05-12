import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cafedra } from '../../models/cafedra.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CafedraService {

  private apiUrl = `${environment.apiUrl}/Cafedra`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) { }

  getCafedras(): Observable<Cafedra[]> {
    return this.http.get<Cafedra[]>(this.apiUrl).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  getCafedra(id: number): Observable<Cafedra> {
    return this.http.get<Cafedra>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  createCafedra(cafedra: Cafedra): Observable<Cafedra> {
    return this.http.post<Cafedra>(this.apiUrl, cafedra).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  updateCafedra(id: number, cafedra: Cafedra): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cafedra).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }

  deleteCafedra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );
  }
}
