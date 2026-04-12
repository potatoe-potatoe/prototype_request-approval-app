export interface ApprovalRequest {
  controlNo: string;
  vendor: string;
  subject: string;
  status: string;
  currentStep: string;
  createdOn: string;
  lastUpdatedOn: string;
}

export enum RequestStatus {
  Draft = 'Draft',
  UnderReview = 'Under Review',
  Returned = 'Returned',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
export const requestStatusList = Object.values(RequestStatus);
