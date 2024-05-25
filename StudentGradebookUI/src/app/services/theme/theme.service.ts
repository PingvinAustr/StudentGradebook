import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'user-theme';
  public darkMode = false;

  constructor() {
    this.loadTheme();
  }

  setDarkMode(enable: boolean) {
    this.darkMode = enable;
    localStorage.setItem(this.themeKey, enable ? 'dark' : 'light');
    this.updateTheme();
  }

  toggleTheme() {
    this.setDarkMode(!this.darkMode);
  }

  loadTheme() {
    const storedTheme = localStorage.getItem(this.themeKey);
    this.darkMode = storedTheme === 'dark';
    this.updateTheme();
  }

  private updateTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
