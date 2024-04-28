import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cafedra } from '../../models/cafedra.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CafedraService {

  private apiUrl = `${environment.apiUrl}/Cafedra`;

  constructor(private http: HttpClient) { }

  getCafedras(): Observable<Cafedra[]> {
    return this.http.get<Cafedra[]>(this.apiUrl);
  }

  getCafedra(id: number): Observable<Cafedra> {
    return this.http.get<Cafedra>(`${this.apiUrl}/${id}`);
  }

  createCafedra(cafedra: Cafedra): Observable<Cafedra> {
    return this.http.post<Cafedra>(this.apiUrl, cafedra);
  }

  updateCafedra(id: number, cafedra: Cafedra): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cafedra);
  }

  deleteCafedra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
