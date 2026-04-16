export interface ApprovalStep {
  approvalGroupName: string;
  comments: ApprovalComment[];
  signatures: ApprovalSignature[];
}

export interface ApprovalComment {
  commenter: string;
  comment: string;
  commentedAt: string;
  references: ApprovalReference[];
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
