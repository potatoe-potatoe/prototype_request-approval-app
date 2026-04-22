import { Component, inject } from '@angular/core';
import { Theme } from '../../core/enums/theme-enum';
import { ThemeService } from '../../core/services/theme-service';
import { Toggle } from "../../core/components/toggle/toggle";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [Toggle],
})
export class Navbar {
  protected readonly THEME = Theme;
  protected readonly themeService = inject(ThemeService);

  protected toggleTheme(): void {
    this.themeService.setTheme(
      this.themeService.theme() === Theme.Dark ? Theme.Light : Theme.Dark
    );
  }
}
