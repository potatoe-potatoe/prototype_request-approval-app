import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { amountOptions, ReviewType, reviewTypes, SelectedFund, TransactionType } from '../../../shared/types/request-type';
import { mockApprovalMatrix, mockApprovers, mockFunds, mockTransactionTypes } from '../../../mock-data';
import { CommentEditor } from '../../../shared/components/comment-editor/comment-editor';
import { ApprovalReference, ApprovalStep } from '../../../shared/types/approval-type';
import { SearchableSelect } from '../../../core/components/searchable-select/searchable-select';
import { Toggle } from '../../../core/components/toggle/toggle';
import { ApprovalStepRow } from './approval-step-row/approval-step-row';
import { DropdownOption } from '../../../core/types/input-type';

@Component({
  selector: 'app-create-request',
  imports: [DecimalPipe, CommentEditor, ReactiveFormsModule, SearchableSelect, Toggle, ApprovalStepRow],
  templateUrl: './create-request.html',
})
export class CreateRequest implements OnInit {
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  protected readonly reviewTypeOptions = reviewTypes;
  protected readonly amountRangeOptions = amountOptions;
  protected readonly form = this.fb.group({
    subject: ['', [Validators.required]],
    reviewType: [ReviewType.Contract as ReviewType | null],
    reviewTypeOther: [''],
    vendor: [''],
    transactionType: [''],
    amountRange: [''],
    funds: this.fb.nonNullable.control<SelectedFund[]>([]),
    comment: this.fb.group({
      text: [''],
      references: this.fb.nonNullable.control<ApprovalReference[]>([]),
    }),
    initialApprovers: this.fb.group({
      directManagerId: this.fb.control<string | null>(null),
      sponsorId: this.fb.control<string | null>(null),
    }),
  });

  protected transactionTypes = signal<TransactionType[]>([]);
  protected approverOptions = signal<DropdownOption[]>([]);
  protected fundOptions = signal<DropdownOption<number>[]>([]);
  protected approvalMatrix = signal<ApprovalStep[]>([]);

  protected newFundId = signal<number | null>(null);
  protected newFundAmount = signal<number | null>(null);
  protected editingFundIndex = signal<number | null>(null);

  protected includeDirectManager = signal(false);
  protected includeSponsor = signal(false);

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadApprovalMatrix();
  }

  // TODO: Fetch from the backend
  private loadDropdownData(): void {
    this.transactionTypes.set(mockTransactionTypes);
    this.approverOptions.set(mockApprovers.map(a => ({ id: a.id, label: a.name })));
    this.fundOptions.set(mockFunds.map(f => ({ id: f.id, label: f.name })));
  }

  // TODO: Fetch from the backend
  private loadApprovalMatrix(): void {
    this.approvalMatrix.set(mockApprovalMatrix.slice(1));
  }

  protected toggleDirectManager(isToggled: boolean): void {
    this.includeDirectManager.set(isToggled);
    if (!isToggled) this.form.controls.initialApprovers.controls.directManagerId.setValue(null);
    
  }

  protected toggleSponsor(isToggled: boolean): void {
    this.includeSponsor.set(isToggled);
    if (!isToggled) this.form.controls.initialApprovers.controls.sponsorId.setValue(null);
  }

  get approverFormGroup() {
    return this.form.controls.initialApprovers;
  }

  protected goBack(): void {
    this.location.back();
  }

  // TODO: Update logic for saving
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

  /**
   * Removes selected funds from the dropdown options, since
   *  a fund can only be selected once.
   */
  get availableFundOptions(): DropdownOption<number>[] {
    const selectedIds = new Set(
      this.form.controls.funds.value
        .filter((_, i) => i !== this.editingFundIndex())
        .map(f => f.id)
    );
    return this.fundOptions().filter(o => !selectedIds.has(o.id));
  }

  getFundName(id: number): string {
    return this.fundOptions().find(o => o.id === id)?.label ?? '';
  }

  protected hasFundInput(): boolean {
    return this.newFundId() !== null && this.newFundAmount() !== null;
  }

  protected addFund(): void {
    if (!this.hasFundInput()) return;
    const id = this.newFundId()!;
    const amount = this.newFundAmount()!;
    const index = this.editingFundIndex();
    const currentFunds = this.form.controls.funds.value;

    if (index != null) this.updateFund(index, id, amount);
    else {
      this.form.controls.funds.setValue([...currentFunds, { id, amount }]);
    }

    this.newFundId.set(null);
    this.newFundAmount.set(null);
  }

  private updateFund(index: number, id: number, amount: number): void {
    const currentFunds = this.form.controls.funds.value;
    this.form.controls.funds.setValue(
      currentFunds.map((f, i) => i === index ? { id, amount } : f)
    );
    this.editingFundIndex.set(null);
  }

  protected removeFund(index: number): void {
    const currentFunds = this.form.controls.funds.value;
    this.form.controls.funds.setValue(currentFunds.filter((_, i) => i !== index));

    if (this.editingFundIndex() === index) {
      this.editingFundIndex.set(null);
      this.newFundId.set(null);
      this.newFundAmount.set(null);
    }
  }

  protected editFund(index: number): void {
    const fund = this.form.controls.funds.value[index];
    this.newFundId.set(fund.id);
    this.newFundAmount.set(fund.amount);
    this.editingFundIndex.set(index);
  }

  protected cancelEditFund(): void {
    this.editingFundIndex.set(null);
    this.newFundId.set(null);
    this.newFundAmount.set(null);
  }

  protected selectTransactionType(value: string): void {
    this.form.controls.transactionType.setValue(value);
    (document.activeElement as HTMLElement)?.blur();
  }
}
