import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApprovalRequest } from '../../types/request-type';
import { RequestsService } from '../../../services/requests-service';
import { ApprovalTable } from './approval-table/approval-table';
import { mockFunds } from '../../../mock-data';

@Component({
  selector: 'app-view-request',
  imports: [DecimalPipe, ApprovalTable],
  templateUrl: './view-request.html',
})
export class ViewRequest implements OnInit {
  protected request = signal<ApprovalRequest | null>(null);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private requestsService = inject(RequestsService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRequest(id);
  }

  // TODO: This method should not be necessary.
  // THe server should return the funds with the name information.
  getFundName(id: number): string {
    return mockFunds.find(f => f.id === id)?.name ?? '';
  }

  private loadRequest(id: string): void {
    this.requestsService.getById(id).subscribe({
      next: (request) => this.request.set(request),
    });
  }

  protected goBack(): void {
    this.location.back();
  }
}
