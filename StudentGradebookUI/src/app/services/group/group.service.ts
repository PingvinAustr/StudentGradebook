import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/Groups`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => this.errorHandler.handleError(error))
    );;
  }

}
