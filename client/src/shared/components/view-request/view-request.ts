import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApprovalRequest } from '../../types/request-type';
import { RequestsService } from '../../../services/requests-service';

@Component({
  selector: 'app-view-request',
  imports: [DecimalPipe],
  templateUrl: './view-request.html',
})
export class ViewRequest implements OnInit {
  protected request = signal<ApprovalRequest | null>(null);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private requestsService = inject(RequestsService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestsService.getById(id).subscribe({
        next: (request) => this.request.set(request),
      });
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
