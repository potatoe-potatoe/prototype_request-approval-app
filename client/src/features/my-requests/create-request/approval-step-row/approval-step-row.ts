import { Component, input } from '@angular/core';

@Component({
  selector: 'tr[appApprovalStepRow]',
  imports: [],
  templateUrl: './approval-step-row.html',
  host: { '[class]': 'hostClass' },
})
export class ApprovalStepRow {
  rowNumber = input.required<number>();

  /**
   * Fixes border rendering issues.
   * DaisyUI applies `border-bottom` to `td/th` elements, not to the `tr`.
   *  Because of this, and the use of `border-collapse: separate`, the
   *  bottom border looks off when the cells are of different heigts.
   * This method surpsresses the `border-bottom` settings on all cells,
   *  and then adds `border-top to every `tr` except the 1st row.
   */
  get hostClass(): string {
    const base = '[&>td]:align-top [&>td]:border-b-0';
    return this.rowNumber() > 1
      ? `${base} [&>td]:border-t [&>td]:border-base-300`
      : base;
  }
}
