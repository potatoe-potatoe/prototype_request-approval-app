import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApprovalRequest } from '../shared/types/request-type';
import { mockRequests } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  // TODO: Replace with real HTTP call when server is available
  getById(id: string): Observable<ApprovalRequest | null> {
    const request = mockRequests.find(r => r.id === id) ?? null;
    return of(request).pipe(delay(500));
  }
}
