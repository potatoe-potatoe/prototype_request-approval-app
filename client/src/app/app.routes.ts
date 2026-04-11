import { Routes } from '@angular/router';
import { Dashboard } from '../features/dashboard/dashboard';
import { Submitted } from '../features/my-requests/submitted/submitted';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'my-requests/submitted', component: Submitted },
];
