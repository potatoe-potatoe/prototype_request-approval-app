import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PagedResult } from '../core/types/pagination-type';
import { RequestStatus } from '../shared/types/request-type';
import { mockRequestsV2 } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class AllRequestsService {
  // TODO: Replace with real HTTP call when server is available
  getRequests(
    statusList: RequestStatus[], searchText = '', page = 1, pageSize = 10
  ): Observable<PagedResult<any>> { // TODO: Do not use 'any'
    let filtered = mockRequestsV2.filter(r => statusList.includes(r.status));

    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.controlNumber.toLowerCase().includes(term) ||
        r.vendor.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term)
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    // TODO: Do not use 'any'
    const result: PagedResult<any> = {
      data,
      pagination: { currentPage: page, pageSize, totalItems, totalPages },
    };

    return of(result).pipe(delay(500));
  }
}
