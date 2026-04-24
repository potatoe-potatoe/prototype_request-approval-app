import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApprovalRequest } from '../shared/types/request-type';
import { mockRequestsV2 } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  // TODO: Replace with real HTTP call when server is available
  getById(id: string): Observable<ApprovalRequest | null> {
    const request = mockRequestsV2.find(r => r.id === id) ?? null;
    return of(request as unknown as ApprovalRequest).pipe(delay(500)); // TODO: Do not use 'unknown'
  }
}
