import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { amountOptions, ReviewType, reviewTypes } from '../../../shared/types/request-type';
import { mockTransactionTypes } from '../../../mock-data';

@Component({
  selector: 'app-create-request',
  imports: [],
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
  protected selectedReviewTypes = signal<ReviewType[]>([]);
  protected reviewTypeOtherText = signal('');
  protected transactionType = signal('');
  protected amountRange = signal('');

  protected readonly isOthersSelected = computed(() =>
    this.selectedReviewTypes().includes(ReviewType.Others)
  );

  protected isReviewTypeSelected(type: ReviewType): boolean {
    return this.selectedReviewTypes().includes(type);
  }

  protected toggleReviewType(type: ReviewType): void {
    const current = this.selectedReviewTypes();
    if (current.includes(type)) {
      this.selectedReviewTypes.set(current.filter(t => t !== type));
      if (type === ReviewType.Others) {
        this.reviewTypeOtherText.set('');
      }
    } else {
      this.selectedReviewTypes.set([...current, type]);
    }
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
