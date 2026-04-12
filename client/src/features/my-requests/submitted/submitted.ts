import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, RequestFilters, RequestStatus, requestStatusList } from '../../../shared/types/request-type';
import { MyRequestsService } from '../my-requests-service';
import { RequestsTable } from '../../../shared/components/requests-table/requests-table';
import { RequestsTableFilters } from '../../../shared/components/requests-table-filters/requests-table-filters';
import { PaginationMetadata } from '../../../core/types/pagination-type';

@Component({
  selector: 'app-submitted',
  templateUrl: './submitted.html',
  imports: [RequestsTable, RequestsTableFilters],
})
export class Submitted implements OnInit {
  protected readonly statusOptions = requestStatusList.filter(
    s => ![RequestStatus.Draft, RequestStatus.Returned].includes(s)
  );

  protected requests = signal<ApprovalRequest[]>([]);
  protected pagination = signal<PaginationMetadata>({} as PaginationMetadata);

  /**
   * Pending filters
   * 
   * These properties are used for pagination changes without affecting
   *  the user's applied filters.
   * There are 2 separate properties because object signals won't work
   *  with model() bindings in the child component.
   */
  protected pendingSearchText = signal('');
  protected pendingStatusList = signal<RequestStatus[]>([...this.statusOptions]);

  // Applied filters
  private appliedFilters: RequestFilters = {
    searchText: '',
    statusList: this.statusOptions
  };

  private myRequestsService = inject(MyRequestsService);

  ngOnInit(): void {
    this.loadRequests(1);
  }

  protected onFiltersApplied(filters: RequestFilters): void {
    this.appliedFilters = { ...filters };
    this.loadRequests(1);
  }

  /**
   * Resets the filter fields.
   * This functionality is elevated to the parent component to
   *  support pagination changes without affecting the user's
   *  applied filters.
   */
  protected onFiltersReset(): void {
    this.pendingSearchText.set('');
    this.pendingStatusList.set([...this.statusOptions]);
    this.appliedFilters = {
      searchText: '',
      statusList: this.statusOptions
    };

    this.loadRequests(1);
  }

  protected changePage(page: number): void {
    this.loadRequests(page);
  }

  /**
   * Updates the item count per page without affecting the user's
   *  applied filters.
   * Pending filter changes are discarded and reverted to the 
   *  previously applied state.
   */
  protected changePageSize(pageSize: number): void {
    this.pendingSearchText.set(this.appliedFilters.searchText);
    this.pendingStatusList.set(this.appliedFilters.statusList!);
    this.loadRequests(1, pageSize);
  }

  private loadRequests(
    page: number,
    pageSize = this.pagination().pageSize ?? 10
  ): void {
    this.myRequestsService
      .getSubmitted(
        this.appliedFilters.statusList ?? this.statusOptions,
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
