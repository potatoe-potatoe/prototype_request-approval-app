// ----------------------------------------
//  Interfaces
// ----------------------------------------
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
  tags: Tag[];
  transactionType: string;
  amount: number;
}

export interface Tag {
  name: string;
  count: number;
}

export interface RequestFilters {
  searchText: string;
  statusList?: RequestStatus[];
}

export interface TransactionType {
  name: string;
  children: TransactionType[];
}

// ----------------------------------------
//  Enums
// ----------------------------------------
export enum ReviewType {
  Onboarding = 'Contract',
  Update = 'Proposal',
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

export enum AmountOption {
  UpTo1M = 'Up to 1M',
  Above1M = 'Above 1M'
}

// ----------------------------------------
//  Constants
// ----------------------------------------
export const reviewTypes = Object.values(ReviewType);
export const requestStatuses = Object.values(RequestStatus);
export const amountOptions = Object.values(AmountOption);
