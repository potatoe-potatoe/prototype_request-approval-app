import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { mockApprovalActivities } from '../../../../mock-data';
import { ApprovalStepActivity } from '../../../types/approval-type';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.html',
  imports: [DatePipe],
})
export class ApprovalTable {
  protected urlCopied = signal("");
  protected urlCopyTimeout = 0;

  // TODO: Pass from parent OR get from service
  protected readonly steps: ApprovalStepActivity[] = mockApprovalActivities;

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
