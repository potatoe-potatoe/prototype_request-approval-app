import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApprovalRequest, RequestStatus } from '../../shared/types/request-type';
import { PagedResult } from '../../core/types/pagination-type';

@Injectable({
  providedIn: 'root',
})
export class MyRequestsService {
  private readonly mockRequests = [
    {
      controlNo: 'REQ-2025-001',
      vendor: 'Acme Supplies Co.',
      subject: 'Office Furniture Procurement',
      status: RequestStatus.UnderReview,
      currentStep: 'Department Head Approval',
      createdOn: '2025-03-01',
      lastUpdatedOn: '2025-03-05',
    },
    {
      controlNo: 'REQ-2025-002',
      vendor: 'TechZone Philippines',
      subject: 'Laptop Replacement — IT Team',
      status: RequestStatus.UnderReview,
      currentStep: 'Budget Review',
      createdOn: '2025-03-08',
      lastUpdatedOn: '2025-03-09',
    },
    {
      controlNo: 'REQ-2025-003',
      vendor: 'CleanPro Services',
      subject: 'Monthly Janitorial Contract Renewal',
      status: RequestStatus.UnderReview,
      currentStep: 'Finance Approval',
      createdOn: '2025-03-10',
      lastUpdatedOn: '2025-03-12',
    },
    {
      controlNo: 'REQ-2025-004',
      vendor: 'FastPrint Solutions',
      subject: 'Printing Supplies — Q2 Stock',
      status: RequestStatus.Draft,
      currentStep: 'Department Head Approval',
      createdOn: '2025-03-15',
      lastUpdatedOn: '2025-03-15',
    },
    {
      controlNo: 'REQ-2025-005',
      vendor: 'GreenLeaf Catering',
      subject: 'Annual Company Outing Catering',
      status: RequestStatus.UnderReview,
      currentStep: 'VP Operations Approval',
      createdOn: '2025-03-18',
      lastUpdatedOn: '2025-03-20',
    },
    {
      controlNo: 'REQ-2025-006',
      vendor: 'SafeGuard Security Inc.',
      subject: 'CCTV System Upgrade — Main Office',
      status: RequestStatus.Draft,
      currentStep: 'Requestor Review',
      createdOn: '2025-03-20',
      lastUpdatedOn: '2025-03-20',
    },
    {
      controlNo: 'REQ-2025-007',
      vendor: 'MediCare Supplies PH',
      subject: 'First Aid Kit Restocking — All Floors',
      status: RequestStatus.Completed,
      currentStep: 'Released',
      createdOn: '2025-03-21',
      lastUpdatedOn: '2025-03-28',
    },
    {
      controlNo: 'REQ-2025-008',
      vendor: 'SwiftCourier Logistics',
      subject: 'Courier Service Contract — Q2',
      status: RequestStatus.Rejected,
      currentStep: 'Budget Review',
      createdOn: '2025-03-22',
      lastUpdatedOn: '2025-03-25',
    },
    {
      controlNo: 'REQ-2025-009',
      vendor: 'PowerSource Electrical',
      subject: 'UPS Unit Replacement — Server Room',
      status: RequestStatus.UnderReview,
      currentStep: 'Finance Approval',
      createdOn: '2025-03-23',
      lastUpdatedOn: '2025-03-26',
    },
    {
      controlNo: 'REQ-2025-010',
      vendor: 'UrbanFurniture PH',
      subject: 'Ergonomic Chairs — HR Department',
      status: RequestStatus.Returned,
      currentStep: 'Requestor Review',
      createdOn: '2025-03-24',
      lastUpdatedOn: '2025-03-27',
    },
    {
      controlNo: 'REQ-2025-011',
      vendor: 'AquaFlow Solutions',
      subject: 'Water Dispenser Maintenance Contract',
      status: RequestStatus.Completed,
      currentStep: 'Released',
      createdOn: '2025-03-25',
      lastUpdatedOn: '2025-04-01',
    },
    {
      controlNo: 'REQ-2025-012',
      vendor: 'BrightMark Advertising',
      subject: 'Tarpaulin Printing — Company Anniversary',
      status: RequestStatus.Cancelled,
      currentStep: 'Cancelled',
      createdOn: '2025-03-26',
      lastUpdatedOn: '2025-03-27',
    },
    {
      controlNo: 'REQ-2025-013',
      vendor: 'NetConnect ISP',
      subject: 'Fiber Internet Upgrade — Branch Office',
      status: RequestStatus.UnderReview,
      currentStep: 'VP Operations Approval',
      createdOn: '2025-03-27',
      lastUpdatedOn: '2025-03-30',
    },
    {
      controlNo: 'REQ-2025-014',
      vendor: 'ElitePrint Digital',
      subject: 'ID Card Printing — New Hires Batch 1',
      status: RequestStatus.Completed,
      currentStep: 'Released',
      createdOn: '2025-03-28',
      lastUpdatedOn: '2025-04-03',
    },
    {
      controlNo: 'REQ-2025-015',
      vendor: 'TechZone Philippines',
      subject: 'Network Switch Replacement — Floor 3',
      status: RequestStatus.Draft,
      currentStep: 'Requestor Review',
      createdOn: '2025-03-29',
      lastUpdatedOn: '2025-03-29',
    },
    {
      controlNo: 'REQ-2025-016',
      vendor: 'PrimeChem Janitorial',
      subject: 'Cleaning Supplies — Monthly Replenishment',
      status: RequestStatus.UnderReview,
      currentStep: 'Department Head Approval',
      createdOn: '2025-03-30',
      lastUpdatedOn: '2025-04-01',
    },
    {
      controlNo: 'REQ-2025-017',
      vendor: 'SolarTech Energy PH',
      subject: 'Solar Panel Installation — Rooftop',
      status: RequestStatus.Returned,
      currentStep: 'Requestor Review',
      createdOn: '2025-04-01',
      lastUpdatedOn: '2025-04-04',
    },
    {
      controlNo: 'REQ-2025-018',
      vendor: 'OfficeWorld Stationery',
      subject: 'Stationery and Bond Paper — Q2 Stock',
      status: RequestStatus.Rejected,
      currentStep: 'Finance Approval',
      createdOn: '2025-04-02',
      lastUpdatedOn: '2025-04-05',
    },
    {
      controlNo: 'REQ-2025-019',
      vendor: 'CoolBreeze HVAC Services',
      subject: 'Aircon Preventive Maintenance — All Units',
      status: RequestStatus.UnderReview,
      currentStep: 'Budget Review',
      createdOn: '2025-04-03',
      lastUpdatedOn: '2025-04-06',
    },
    {
      controlNo: 'REQ-2025-020',
      vendor: 'SafeVault Document Storage',
      subject: 'Offsite Document Archiving — FY2024 Records',
      status: RequestStatus.Draft,
      currentStep: 'Requestor Review',
      createdOn: '2025-04-05',
      lastUpdatedOn: '2025-04-05',
    },
  ] as ApprovalRequest[];

  // GET api/v1/my-requests?status=Draft&search=keyword&page=1&pageSize=10
  getDrafts(searchText = '', page = 1, pageSize = 10): Observable<PagedResult<ApprovalRequest>> {
    return this.getRequests([RequestStatus.Draft], searchText, page, pageSize);
  }

  // GET api/v1/my-requests?status=UnderReview&status=Completed&...&search=keyword&page=1&pageSize=10
  getSubmitted(statusList: RequestStatus[], searchText = '', page = 1, pageSize = 10): Observable<PagedResult<ApprovalRequest>> {
    return this.getRequests(statusList, searchText, page, pageSize);
  }

  // TODO: Replace with real HTTP call when server is available
  private getRequests(
    statusList: RequestStatus[], searchText: string, page: number, pageSize: number
  ): Observable<PagedResult<ApprovalRequest>> {
    let filtered = this.mockRequests.filter(r => statusList.includes(r.status));

    // Mock filtering
    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.controlNo.toLowerCase().includes(term) ||
        r.vendor.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term)
      );
    }

    // Mock pagination info
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const result: PagedResult<ApprovalRequest> = {
      data,
      pagination: { currentPage: page, pageSize, totalItems, totalPages },
    };

    return of(result).pipe(delay(1500));
  }
}
