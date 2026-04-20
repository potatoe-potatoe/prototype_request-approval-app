import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { amountOptions, Fund, ReviewType, reviewTypes, TransactionType } from '../../../shared/types/request-type';
import { mockManagers, mockTransactionTypes } from '../../../mock-data';
import { CommentEditor } from '../../../shared/components/comment-editor/comment-editor';

@Component({
  selector: 'app-create-request',
  imports: [DecimalPipe, CommentEditor, ReactiveFormsModule],
  templateUrl: './create-request.html',
})
export class CreateRequest {
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  protected readonly reviewTypeOptions = reviewTypes;

  // TODO: Fetch from the backend
  protected readonly transactionTypes: TransactionType[] = mockTransactionTypes as TransactionType[];
  protected readonly amountRangeOptions = amountOptions;
  protected readonly approverOptions = mockManagers;

  protected readonly form = this.fb.group({
    subject: ['', [Validators.required]],
    reviewType: [null as ReviewType | null],
    reviewTypeOther: [''],
    vendor: [''],
    transactionType: [''],
    amountRange: [''],
    funds: this.fb.nonNullable.control<Fund[]>([]),
  });

  protected newFundName = signal('');
  protected newFundAmount = signal<number | null>(null);

  // Not yet converted
  protected includeDirectManager = signal(false);
  protected directManagerId = signal('');
  protected includeSponsor = signal(false);
  protected sponsorId = signal('');

  protected goBack(): void {
    this.location.back();
  }

  protected saveDraft(): void {
    console.log(this.form.value);
  }

  get isOthersSelected(): boolean {
    return this.form.controls.reviewType.value === ReviewType.Others;
  }

  protected selectReviewType(type: ReviewType): void {
    this.form.controls.reviewType.setValue(type);
    if (type !== ReviewType.Others) {
      this.form.controls.reviewTypeOther.setValue('');
    }
  }

  protected hasNewFund(): boolean {
    const name = this.newFundName().trim();
    const count = this.newFundAmount();
    const hasName = (name && name.length > 0) as boolean;
    const hasCount = !!count as boolean;
    return hasName && hasCount;
  }

  protected addFund(): void {
    if (!this.hasNewFund()) return;
    const name = this.newFundName().trim();
    const count = this.newFundAmount() ?? 0;
    const current = this.form.controls.funds.value;
    this.form.controls.funds.setValue([...current, { name, count }]);
    this.newFundName.set('');
    this.newFundAmount.set(null);
  }

  protected removeFund(index: number): void {
    const current = this.form.controls.funds.value;
    this.form.controls.funds.setValue(current.filter((_: Fund, i: number) => i !== index));
  }

  protected selectTransactionType(value: string): void {
    this.form.controls.transactionType.setValue(value);
    (document.activeElement as HTMLElement)?.blur();
  }
}
