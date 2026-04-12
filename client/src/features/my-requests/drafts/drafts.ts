import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, RequestStatus, requestStatusList } from '../../../shared/types/request-type';
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
  protected readonly statusOptions = requestStatusList.filter(
    s => ![RequestStatus.Draft, RequestStatus.Returned].includes(s)
  );
  protected requests = signal<ApprovalRequest[]>([]);
  protected paginationData = signal<PaginationMetadata>({} as PaginationMetadata);

  private myRequestsService = inject(MyRequestsService);

  ngOnInit(): void {
    this.myRequestsService.getDrafts().subscribe({
      next: (response) => {
        this.requests.set(response.data);
        this.paginationData.set(response.pagination);
      }
    });
  }
}
