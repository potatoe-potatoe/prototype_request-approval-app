import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PagedResult } from '../../core/types/pagination-type';
import { RequestStatus, ApprovalRequest } from '../../shared/types/request-type';
import { mockRequests } from '../../mock-data';

@Injectable({
  providedIn: 'root',
})
export class AllRequestsService {
  // TODO: Replace with real HTTP call when server is available
  getRequests(
    statusList: RequestStatus[], searchText = '', page = 1, pageSize = 10
  ): Observable<PagedResult<ApprovalRequest>> {
    // Mock filtering for status
    let filtered = mockRequests.filter(r => statusList.includes(r.status));

    // Mock filtering for search text
    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.controlNo.toLowerCase().includes(term) ||
        r.vendor.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term)
      );
    }

    // Mock pagination info
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const result: PagedResult<ApprovalRequest> = {
      data,
      pagination: { currentPage: page, pageSize, totalItems, totalPages },
    };

    return of(result).pipe(delay(500));
  }
}
