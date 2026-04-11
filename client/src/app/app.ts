import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../layout/navbar/navbar';
import { Sidebar } from '../layout/sidebar/sidebar';
import { ThemeService } from '../core/services/theme-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, Navbar, Sidebar],
})
export class App {
  protected readonly themeService = inject(ThemeService);
}
