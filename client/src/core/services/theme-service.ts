import { Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme-enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly key = 'theme';
  private readonly defaultTheme = Theme.Light;

  private readonly _theme = signal<Theme>(this.defaultTheme);
  readonly theme = this._theme.asReadonly();

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.key, theme);
    this._theme.set(theme);
    console.info(`Theme is set to "${theme}".`);
  }

  private loadTheme(): void {
    let theme = localStorage.getItem(this.key) ?? '';
    if (!this.isTheme(theme)) {
      console.warn(`No theme detected. Using default theme: ${this.defaultTheme}`);
      theme = this.defaultTheme;
    }
    this._theme.set(theme as Theme);
  }

  private isTheme(theme: string): boolean {
    return Object.values(Theme).includes(theme as Theme);
  }
}
