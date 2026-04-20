export interface ApprovalStep {
  approvalGroupName: string;
  comments: ApprovalComment[];
  signatures: ApprovalSignature[];
}

export interface DraftApprovalComment {
  comment: string;
  references: ApprovalReference[];
}

export interface ApprovalComment extends DraftApprovalComment {
  commenter: string;
  commentedAt: string;
}

export interface ApprovalSignature {
  name: string;
  isSigned: boolean;
  signedAt: string | null;
}

export interface ApprovalReference {
  label: string;
  url: string;
}
