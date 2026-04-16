import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { mockApprovalMatrix } from '../../../../mock-data';
import { ApprovalStep } from '../../../types/approval-type';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.html',
  imports: [DatePipe],
})
export class ApprovalTable {
  private urlCopied = signal("");
  protected urlCopyTimeout = 0;

  // TODO: Pass from parent OR get from service
  protected readonly steps: ApprovalStep[] = mockApprovalMatrix;

  protected copyToClipboard(url: string, id: string): void {
    navigator.clipboard.writeText(url);
    this.urlCopied.set(id)
    clearTimeout(this.urlCopyTimeout);

    this.urlCopyTimeout = setTimeout(
      () => this.urlCopied.set(""),
      2500
    );
  }

  protected isUrlCopied(id: string): boolean {
    return this.urlCopied() === id;
  }
}
