import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, RequestFilters } from '../../../shared/types/request-type';
import { MyRequestsService } from '../my-requests-service';
import { PaginationMetadata } from '../../../core/types/pagination-type';
import { RequestsTableFilters } from "../../../shared/components/requests-table-filters/requests-table-filters";
import { RequestsTable } from "../../../shared/components/requests-table/requests-table";

@Component({
  selector: 'app-drafts',
  imports: [RequestsTableFilters, RequestsTable],
  templateUrl: './drafts.html',
})
export class Drafts implements OnInit {
  protected requests = signal<ApprovalRequest[]>([]);
  protected pagination = signal<PaginationMetadata>({} as PaginationMetadata);

  // Pending filters
  protected pendingSearchText = signal('');

  // Applied filters
  private appliedFilters: RequestFilters = {
    searchText: ''
  };

  private myRequestsService = inject(MyRequestsService);

  ngOnInit(): void {
    this.loadRequests(1);
  }

  protected onFiltersApplied(filters: RequestFilters): void {
    this.appliedFilters = { ...filters };
    this.loadRequests(1);
  }

  protected onFiltersReset(): void {
    this.pendingSearchText.set('');
    this.appliedFilters = {
      searchText: ''
    };

    this.loadRequests(1);
  }

  protected changePage(page: number): void {
    this.loadRequests(page);
  }

  protected changePageSize(pageSize: number): void {
    this.pendingSearchText.set(this.appliedFilters.searchText);
    this.loadRequests(1, pageSize);
  }

  private loadRequests(
    page: number,
    pageSize = this.pagination().pageSize ?? 10
  ): void {
    this.myRequestsService
      .getDrafts(
        this.appliedFilters.searchText,
        page,
        pageSize
      )
      .subscribe({
        next: (response) => {
          this.requests.set(response.data);
          this.pagination.set(response.pagination);
        }
      });
  }
}
