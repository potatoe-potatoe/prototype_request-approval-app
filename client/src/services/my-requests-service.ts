import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApprovalRequest, RequestStatus } from '../shared/types/request-type';
import { PagedResult } from '../core/types/pagination-type';
import { mockRequestsV2 } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class MyRequestsService {
  // GET api/v1/my-requests?status=Draft&search=keyword&page=1&pageSize=10
  getDrafts(searchText = '', page = 1, pageSize = 10): Observable<PagedResult<ApprovalRequest>> {
    return this.getRequests([RequestStatus.Draft], searchText, page, pageSize);
  }

  // GET api/v1/my-requests?status=UnderReview&status=Completed&...&search=keyword&page=1&pageSize=10
  getSubmitted(statusList: RequestStatus[], searchText = '', page = 1, pageSize = 10): Observable<PagedResult<ApprovalRequest>> {
    return this.getRequests(statusList, searchText, page, pageSize);
  }

  // TODO: Replace with real HTTP call when server is available
  private getRequests(
    statusList: RequestStatus[], searchText: string, page: number, pageSize: number
  ): Observable<PagedResult<any>> { // TODO: Do not use 'any'
    let filtered = mockRequestsV2.filter(r => statusList.includes(r.status));

    // Mock filtering
    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.controlNumber.toLowerCase().includes(term) ||
        r.vendor.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term)
      );
    }

    // Mock pagination info
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
