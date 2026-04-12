import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest, RequestStatus, requestStatusList } from '../../shared/types/request-type';
import { PaginationMetadata } from '../../core/types/pagination-type';
import { MyRequestsService } from '../my-requests/my-requests-service';
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
  protected paginationData = signal<PaginationMetadata>({} as PaginationMetadata);

  private allRequestsService = inject(AllRequestsService);

  ngOnInit(): void {
    this.allRequestsService.getRequests(this.statusOptions).subscribe({
      next: (response) => {
        this.requests.set(response.data);
        this.paginationData.set(response.pagination);
      }
    });
  }
}
