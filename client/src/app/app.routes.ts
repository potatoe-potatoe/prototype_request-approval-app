import { Routes } from '@angular/router';
import { Dashboard } from '../features/dashboard/dashboard';
import { Drafts } from '../features/my-requests/drafts/drafts';
import { Submitted } from '../features/my-requests/submitted/submitted';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'my-requests',
    children: [
      { path: 'drafts', component: Drafts },
      { path: 'submitted', component: Submitted },
    ],
  },
];
