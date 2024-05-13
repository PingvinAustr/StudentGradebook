import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/Groups`;
  headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
  });
  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService, private authService: AuthService) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

}
