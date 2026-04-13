export interface ApprovalRequest {
  id: string;
  controlNo: string;
  vendor: string;
  subject: string;
  status: RequestStatus;
  currentStep: string;
  createdOn: string;
  lastUpdatedOn: string;
  reviewTypes: ReviewType[];
  tags: string[];
  transactionType: string;
  amount: number;
}

// TODO: Check if necessary without the mock data file
export enum ReviewType {
  Onboarding = 'Onboarding',
  Update = 'Update',
  Others = 'Others',
}

export enum RequestStatus {
  Draft = 'Draft',
  UnderReview = 'In Progress',
  Returned = 'Returned',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
export const requestStatusList = Object.values(RequestStatus);

export interface RequestFilters {
  searchText: string;
  statusList?: RequestStatus[];
}
