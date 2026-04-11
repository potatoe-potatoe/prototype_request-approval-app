import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../layout/navbar/navbar';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, Navbar, Sidebar],
})
export class App {}
