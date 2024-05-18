import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentUserInfo } from '../../models/currentuserinfo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/Cafedra`;

  constructor(private http: HttpClient) { }

  getUserApi(): Observable<CurrentUserInfo[]> {
    return this.http.get<CurrentUserInfo[]>(this.apiUrl);
  }

  getUser(): CurrentUserInfo {
    return JSON.parse(localStorage.getItem('user'));
  }
}
