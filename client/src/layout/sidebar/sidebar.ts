import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, iconPaths } from '../../core/enums/icon-enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  imports: [RouterLink, RouterLinkActive],
})
export class Sidebar {
  protected readonly iconPaths = iconPaths;
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: Icon.Squares2x2 },
    {
      label: 'My Requests',
      route: '/',
      icon: Icon.Inbox,
      children: [
        { label: 'Drafts', route: '/my-requests/drafts', icon: Icon.PencilSquare },
        { label: 'Submitted', route: '/my-requests/submitted', icon: Icon.PaperAirplane },
      ],
    },
    // TODO: Uncomment once the core pages are done
    // {
    //   label: 'My Approvals',
    //   route: '/',
    //   icon: Icon.ClipboardDocumentCheck,
    //   children: [
    //     { label: 'Upcoming', route: '/', icon: Icon.CalendarDays },
    //     { label: 'Pending', route: '/', icon: Icon.Clock },
    //     { label: 'Completed', route: '/', icon: Icon.CheckCircle },
    //   ],
    // },
    { label: 'All Requests', route: '/all-requests', icon: Icon.QueueList },
  ];

  protected collapsed = signal(false);

  protected toggle() {
    this.collapsed.update((v) => !v);
  }
}

// TODO: Transfer in a dedicated file
interface NavItem {
  label: string;
  route: string;
  icon: Icon;
  children?: NavItem[];
}
