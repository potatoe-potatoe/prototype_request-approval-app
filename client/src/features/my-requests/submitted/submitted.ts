import { Component, inject, OnInit, signal } from '@angular/core';
import { ApprovalRequest } from '../../../types/request-type';
import { MyRequestsService } from '../my-requests-service';

@Component({
  selector: 'app-submitted',
  templateUrl: './submitted.html',
})
export class Submitted implements OnInit {
  protected readonly columns = [
    'Control #',
    'Vendor',
    'Subject',
    'Current Step',
    'Created On',
    'Last Updated On'
  ];
  protected requests = signal<ApprovalRequest[]>([]);

  private myRequestsService = inject(MyRequestsService);

  ngOnInit(): void {
    this.myRequestsService.getSubmitted().subscribe({
      next: (requests) => {
        this.requests.set(requests);
      }
    });
  }
}
