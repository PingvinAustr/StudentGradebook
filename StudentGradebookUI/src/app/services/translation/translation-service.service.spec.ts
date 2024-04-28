import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang: string = 'EN';
  private translations: any = {};

  constructor(private http: HttpClient) {}

  loadTranslations(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`).pipe(
      map(response => {
        this.translations = response;
        this.currentLang = lang;
      }),
      catchError(() => {
        console.error('Failed to load translations');
        return of({});
      })
    );
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }

  setCurrentLanguage(lang: string) {
    this.loadTranslations(lang).subscribe();
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }
}
