import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [RouterLink, RouterLinkActive],
})
export class Sidebar {
  protected collapsed = signal(false);

  protected toggle() {
    this.collapsed.update((v) => !v);
  }
}
