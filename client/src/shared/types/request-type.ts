import { ApprovalComment, Approver } from "./approval-type";

// ----------------------------------------
//  Interfaces
// ----------------------------------------
interface BaseEditRequest {
  id: string; // publicId UUID v4
  subject: string;
  reviewType: ReviewType;
  reviewTypeOther?: string;
  funds: SelectedFund[];
  preapproverManager?: Approver;
  preapproverSponsor?: Approver;
  comment?: ApprovalComment;
}

export interface EditDraftRequest extends BaseEditRequest {
  vendor?: string;
  transactionType?: SelectedTransactionType;
  amountBracket?: AmountOption;
}

export interface EditSubmittedRequest extends BaseEditRequest {
  vendor: string;
  transactionType: SelectedTransactionType;
  amountBracket: AmountOption;
}

// export interface DraftRequest {
//   id: string; // publicId
//   subject: string;
//   vendor?: string;
//   reviewType: ReviewType;
//   reviewTypeOther?: string;
//   funds: SelectedFund[];
//   transactionType?: SelectedTransactionType;
//   amountBracket?: AmountOption;
//   preapproverManager?: Approver;
//   preapproverSponsor?: Approver;
//   comment?: ApprovalComment;
//   createdAt: string;
//   updatedAt?: string;
// }

export interface SelectedTransactionType {
  id: number;
  name: string;
}

export interface SelectedFund {
  id: number;
  name: string;
  amount: number;
}

// TODO: ALl those interfaces up there -- Check if they can be merged with their counterparts below.

// export interface SubmittedRequest {
//   id: string; // publicId
//   status: RequestStatus;
//   controlNumber: string;
//   subject: string;
//   vendor: string;
//   reviewType: ReviewType;
//   reviewTypeOther?: string;
//   funds: SelectedFund[];
//   transactionType: string;
//   amountBracket: AmountOption;
//   createdAt: string;
//   updatedAt: string;
//   submittedAt: string;
//   completedAt?: string;
//   cancelledAt?: string;
//   rejectedAt?: string;
// }

// TODO: ALl those interfaces up there -- Check if they can be merged with their counterparts below.

// TODO: Table view should have minimal data
// BasePreviewRequest
// PreviewDraftRequest
// PreviewSubmittedRequest

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
  funds: Fund[];
  transactionType: string;
  amount: number;
}

export interface Fund {
  id?: number;
  name: string;
  amount: number;
}

export interface RequestFilters {
  searchText: string;
  statusList?: RequestStatus[];
}

export interface TransactionType {
  id: number;
  name: string;
  children: TransactionType[];
}

// ----------------------------------------
//  Enums
// ----------------------------------------
export enum ReviewType {
  Contract = 'Contract',
  Proposal = 'Proposal',
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
