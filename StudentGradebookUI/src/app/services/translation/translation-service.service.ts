import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public currentLang: string = 'EN'; // Default language
  private translations: any = {};

  public Languages = [
    { code: 'EN', label: 'English' },
    { code: 'UA', label: 'Українська' }
  ];

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const storedLang = localStorage.getItem('appLang');
    if (storedLang) {
      this.currentLang = storedLang;
      this.loadTranslations(storedLang).subscribe(); // Pre-load translations
    } else {
      this.setCurrentLanguage(this.currentLang); // Set default language if none in storage
    }
  }

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

  setCurrentLanguage(lang: string): void {
    localStorage.setItem('appLang', lang);
    this.loadTranslations(lang).subscribe();
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }
}
