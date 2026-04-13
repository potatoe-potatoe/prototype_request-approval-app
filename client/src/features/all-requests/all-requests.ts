import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, RequestFilters, RequestStatus, requestStatusList } from '../../shared/types/request-type';
import { PaginationMetadata } from '../../core/types/pagination-type';
import { RequestsTableFilters } from "../../shared/components/requests-table-filters/requests-table-filters";
import { RequestsTable } from "../../shared/components/requests-table/requests-table";
import { AllRequestsService } from './all-requests-service';

@Component({
  selector: 'app-all-requests',
  imports: [RequestsTableFilters, RequestsTable],
  templateUrl: './all-requests.html',
})
export class AllRequests implements OnInit {
  protected readonly statusOptions = requestStatusList.filter(s => s !== RequestStatus.Draft);
  protected requests = signal<ApprovalRequest[]>([]);
  protected pagination = signal<PaginationMetadata>({} as PaginationMetadata);

  // Pending filters
  protected pendingSearchText = signal('');
  protected pendingStatusList = signal<RequestStatus[]>([...this.statusOptions]);

  // Applied filters
  private appliedFilters: RequestFilters = {
    searchText: '',
    statusList: this.statusOptions
  };

  private allRequestsService = inject(AllRequestsService);

  ngOnInit(): void {
    this.loadRequests(1);
  }

  protected onFiltersApplied(filters: RequestFilters): void {
    this.appliedFilters = { ...filters };
    this.loadRequests(1);
  }

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

  protected changePageSize(pageSize: number): void {
    this.pendingSearchText.set(this.appliedFilters.searchText);
    this.pendingStatusList.set(this.appliedFilters.statusList!);
    this.loadRequests(1, pageSize);
  }

  private loadRequests(
    page: number,
    pageSize = this.pagination().pageSize ?? 10
  ): void {
    this.allRequestsService
      .getRequests(
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
