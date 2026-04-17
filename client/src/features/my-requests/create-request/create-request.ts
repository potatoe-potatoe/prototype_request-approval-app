import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { amountOptions, ReviewType, reviewTypes, Tag } from '../../../shared/types/request-type';
import { mockTransactionTypes } from '../../../mock-data';

@Component({
  selector: 'app-create-request',
  imports: [DecimalPipe],
  templateUrl: './create-request.html',
})
export class CreateRequest {
  private readonly location = inject(Location);

  protected readonly ReviewType = ReviewType;
  protected readonly reviewTypeOptions = reviewTypes;
  protected readonly transactionTypes: TransactionTypeNode[] = mockTransactionTypes as TransactionTypeNode[];
  protected readonly amountRangeOptions = amountOptions;

  protected subject = signal('');
  protected vendor = signal('');
  protected selectedReviewType = signal<ReviewType | null>(null);
  protected reviewTypeOtherText = signal('');
  protected transactionType = signal('');
  protected amountRange = signal('');
  protected tags = signal<Tag[]>([]);
  protected newTagName = signal('');
  protected newTagAmount = signal<number | null>(null);

  protected readonly isOthersSelected = computed(() =>
    this.selectedReviewType() === ReviewType.Others
  );

  protected selectReviewType(type: ReviewType): void {
    this.selectedReviewType.set(type);
    if (type !== ReviewType.Others) {
      this.reviewTypeOtherText.set('');
    }
  }

  protected addTag(): void {
    const name = this.newTagName().trim();
    const count = this.newTagAmount() ?? 0;
    if (!name) return;
    this.tags.update(tags => [...tags, { name, count }]);
    this.newTagName.set('');
    this.newTagAmount.set(null);
  }

  protected removeTag(index: number): void {
    this.tags.update(tags => tags.filter((_, i) => i !== index));
  }

  protected selectTransactionType(value: string): void {
    this.transactionType.set(value);
    (document.activeElement as HTMLElement)?.blur();
  }

  protected goBack(): void {
    this.location.back();
  }
}

interface TransactionTypeNode {
  name: string;
  children: TransactionTypeNode[];
}
