import { Routes } from '@angular/router';
import { Dashboard } from '../features/dashboard/dashboard';
import { Drafts } from '../features/my-requests/drafts/drafts';
import { Submitted } from '../features/my-requests/submitted/submitted';
import { AllRequests } from '../features/all-requests/all-requests';
import { ViewRequest } from '../shared/components/view-request/view-request';
import { CreateRequest } from '../features/my-requests/create-request/create-request';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'requests',
    children: [
      {
        path: 'my',
        children: [
          { path: 'drafts', component: Drafts },
          { path: 'submitted', component: Submitted }
        ]
      },
      { path: 'all', component: AllRequests },
      { path: 'new', component: CreateRequest },
      { path: ':id', component: ViewRequest }
    ]
  }
];
