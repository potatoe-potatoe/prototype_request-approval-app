import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, requestStatusList } from '../../../shared/types/request-type';
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
  protected readonly statusOptions = requestStatusList.filter(s => s !== 'Draft');
  protected requests = signal<ApprovalRequest[]>([]);
  protected paginationData = signal<PaginationMetadata>({} as PaginationMetadata);

  private myRequestsService = inject(MyRequestsService);

  ngOnInit(): void {
    this.myRequestsService.getSubmitted().subscribe({
      next: (requests) => {
        this.requests.set(requests);

        // TODO: Remove hard-coded setting once endpoint is available
        this.paginationData.update(p => {
          p.currentPage = 1;
          p.totalPages = 1;
          p.pageSize = 20;
          p.totalItems = requests.length;
          return p;
        });
      }
    });
  }
}
