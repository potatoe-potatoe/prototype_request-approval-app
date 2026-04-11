import { Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme-enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly key = 'theme';
  private readonly defaultTheme = Theme.Light;

  theme = signal<Theme>(this.defaultTheme);

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.key, theme);
    this.theme.set(theme);
    console.info(`Theme is set to "${theme}".`);
  }

  private loadTheme(): void {
    let theme = localStorage.getItem(this.key) ?? '';
    if (!this.isTheme(theme)) {
      console.warn(`No theme detected. Using default theme: ${this.defaultTheme}`);
      theme = this.defaultTheme;
    }
    this.theme.set(theme as Theme);
  }

  private isTheme(theme: string): boolean {
    return Object.values(Theme).includes(theme as Theme);
  }
}
