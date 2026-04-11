import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApprovalRequest } from '../../types/request-type';

@Injectable({
  providedIn: 'root',
})
export class MyRequestsService {
  getSubmitted(): Observable<ApprovalRequest[]> {
    const mockData = [
      {
        controlNo: 'REQ-2025-001',
        vendor: 'Acme Supplies Co.',
        subject: 'Office Furniture Procurement',
        currentStep: 'Department Head Approval',
        createdOn: '2025-03-01',
        lastUpdatedOn: '2025-03-05',
      },
      {
        controlNo: 'REQ-2025-002',
        vendor: 'TechZone Philippines',
        subject: 'Laptop Replacement — IT Team',
        currentStep: 'Budget Review',
        createdOn: '2025-03-08',
        lastUpdatedOn: '2025-03-09',
      },
      {
        controlNo: 'REQ-2025-003',
        vendor: 'CleanPro Services',
        subject: 'Monthly Janitorial Contract Renewal',
        currentStep: 'Finance Approval',
        createdOn: '2025-03-10',
        lastUpdatedOn: '2025-03-12',
      },
      {
        controlNo: 'REQ-2025-004',
        vendor: 'FastPrint Solutions',
        subject: 'Printing Supplies — Q2 Stock',
        currentStep: 'Department Head Approval',
        createdOn: '2025-03-15',
        lastUpdatedOn: '2025-03-15',
      },
      {
        controlNo: 'REQ-2025-005',
        vendor: 'GreenLeaf Catering',
        subject: 'Annual Company Outing Catering',
        currentStep: 'VP Operations Approval',
        createdOn: '2025-03-18',
        lastUpdatedOn: '2025-03-20',
      },
    ] as ApprovalRequest[]

    return of(mockData)
      .pipe(delay(1500));
  }
}
