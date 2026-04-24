import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RequestsService } from '../../../services/requests-service';
import { ApprovalTable } from './approval-table/approval-table';

@Component({
  selector: 'app-view-request',
  imports: [DecimalPipe, ApprovalTable, RouterLink],
  templateUrl: './view-request.html',
})
export class ViewRequest implements OnInit {
  
  // TODO: Do not use 'any'
  protected request = signal<any | null>(null);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private requestsService = inject(RequestsService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadRequest(id);
  }

  // TODO: Fetch from the backend
  private loadRequest(id: string | null): void {
    if (!id) {
      // TODO: Add error handling, maybe a 404 page
      return;
    }

    this.requestsService.getById(id).subscribe({
      next: (request) => {
        if (request) this.request.set(request);
        else {
          // TODO: Add error handling, maybe a 404 page
        }
      },
    });
  }

  protected goBack(): void {
    this.location.back();
  }

  get requestEditLink(): string {
    const id = this.request()!.id;
    return `/requests/${id}/edit`;
  }
}
