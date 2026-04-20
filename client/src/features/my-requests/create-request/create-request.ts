import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { amountOptions, ReviewType, reviewTypes, Tag, TransactionType } from '../../../shared/types/request-type';
import { mockTransactionTypes } from '../../../mock-data';
import { CommentEditor } from '../../../shared/components/comment-editor/comment-editor';

@Component({
  selector: 'app-create-request',
  imports: [DecimalPipe, CommentEditor, ReactiveFormsModule],
  templateUrl: './create-request.html',
})
export class CreateRequest {
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  protected readonly ReviewType = ReviewType;
  protected readonly reviewTypeOptions = reviewTypes;
  protected readonly transactionTypes: TransactionType[] = mockTransactionTypes as TransactionType[];
  protected readonly amountRangeOptions = amountOptions;

  protected readonly form = this.fb.group({
    subject: ['', [Validators.required]],
    reviewType: [null as ReviewType | null],
    reviewTypeOther: [''],
    vendor: [''],
    transactionType: [''],
    amountRange: [''],
    tags: this.fb.nonNullable.control<Tag[]>([]),
  });

  // Not yet converted
  protected newTagName = signal('');
  protected newTagAmount = signal<number | null>(null);
  protected includeDirectManager = signal(false);
  protected directManagerId = signal('');
  protected includeSponsor = signal(false);
  protected sponsorId = signal('');

  protected readonly approverOptions = [
    'Santos, Maria',
    'Reyes, Juan',
    'Cruz, Ana',
    'Garcia, Luis',
    'Torres, Carmen',
  ];

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

  protected hasNewTag(): boolean {
    const name = this.newTagName().trim();
    const count = this.newTagAmount();
    const hasName = (name && name.length > 0) as boolean;
    const hasCount = !!count as boolean;
    return hasName && hasCount;
  }

  protected addTag(): void {
    if (!this.hasNewTag()) return;
    const name = this.newTagName().trim();
    const count = this.newTagAmount() ?? 0;
    const current = this.form.controls.tags.value;
    this.form.controls.tags.setValue([...current, { name, count }]);
    this.newTagName.set('');
    this.newTagAmount.set(null);
  }

  protected removeTag(index: number): void {
    const current = this.form.controls.tags.value;
    this.form.controls.tags.setValue(current.filter((_, i) => i !== index));
  }

  protected selectTransactionType(value: string): void {
    this.form.controls.transactionType.setValue(value);
    (document.activeElement as HTMLElement)?.blur();
  }
}
