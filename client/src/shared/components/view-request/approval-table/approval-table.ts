import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { mockApprovalMatrix } from '../../../../mock-data';
import { ApprovalReference, ApprovalStep } from '../../../types/approval-type';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.html',
  imports: [DatePipe],
})
export class ApprovalTable {
  // TODO: Pass from parent OR get from service
  protected readonly steps: ApprovalStep[] = mockApprovalMatrix;

  // TODO: Transfer to a helper service
  protected getReferenceList(refString: string): ApprovalReference[] {
    return refString.split(' | ').map(ref => {
      const urlMatch = ref.match(/https?:\/\/.+/);
      if (urlMatch) {
        const url = urlMatch[0];
        const label = ref.slice(0, ref.indexOf(url)).replace(/\s*-\s*$/, '').trim();
        return { label, url };
      }

      return {
        label: ref,
        url: ''
      };
    });
  }
}


