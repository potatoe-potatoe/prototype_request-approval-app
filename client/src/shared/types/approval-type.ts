export interface ApprovalStep {
  approvalGroupName: string;
  comments: ApprovalComment[];
  references: string;
  signatures: ApprovalSignature[];
}

export interface ApprovalComment {
  commenter: string;
  comment: string;
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
