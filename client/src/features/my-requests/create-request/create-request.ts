import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { amountOptions, Fund, ReviewType, reviewTypes, TransactionType } from '../../../shared/types/request-type';
import { mockApprovalMatrix, mockApprovers, mockTransactionTypes } from '../../../mock-data';
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
    funds: this.fb.nonNullable.control<Fund[]>([]),
    comment: this.fb.group({
      text: [''],
      references: this.fb.nonNullable.control<ApprovalReference[]>([]),
    }),
  });

  protected transactionTypes = signal<TransactionType[]>([]);
  protected approverOptions = signal<DropdownOption[]>([]);
  protected approvalMatrix = signal<ApprovalStep[]>([]);

  protected newFundName = signal('');
  protected newFundAmount = signal<number | null>(null);
  protected editingFundIndex = signal<number | null>(null);

  // Not yet converted
  protected includeDirectManager = signal(false);
  protected directManagerId = signal<string | null>(null);
  protected includeSponsor = signal(false);
  protected sponsorId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadApprovalMatrix();
  }

  // TODO: Fetch from the backend
  protected loadDropdownData(): void {
    this.transactionTypes.set(mockTransactionTypes);
    this.approverOptions.set(mockApprovers.map(
      a => ({ id: a.id, label: a.name }))
    );
  }

  // TODO: Fetch from the backend
  protected loadApprovalMatrix(): void {
    this.approvalMatrix.set(mockApprovalMatrix.slice(1));
  }

  protected toggleDirectManager(isToggled: boolean): void {
    this.includeDirectManager.set(isToggled);
    if (!isToggled) this.directManagerId.set(null);
  }

  protected toggleSponsor(isToggled: boolean): void {
    this.includeSponsor.set(isToggled);
    if (!isToggled) this.sponsorId.set(null);
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

  protected hasFundInput(): boolean {
    const name = this.newFundName().trim();
    const amount = this.newFundAmount();
    const hasName = (name && name.length > 0) as boolean;
    const hasAmount = !!amount as boolean;
    return hasName && hasAmount;
  }

  protected addFund(): void {
    if (!this.hasFundInput()) return;
    const name = this.newFundName().trim();
    const amount = this.newFundAmount() ?? 0;
    const index = this.editingFundIndex();
    const currentFunds = this.form.controls.funds.value;

    if (index != null) this.updateFund(index, name, amount);
    else {
      this.form.controls.funds.setValue([...currentFunds, { name, amount }]);
    }

    this.newFundName.set('');
    this.newFundAmount.set(null);
  }

  private updateFund(index: number, name: string, amount: number): void {
    const currentFunds = this.form.controls.funds.value;
    this.form.controls.funds.setValue(
      currentFunds.map((f, i) => i === index ? { name, amount }: f)
    );
    this.editingFundIndex.set(null);
  }

  protected removeFund(index: number): void {
    const currentFunds = this.form.controls.funds.value;
    this.form.controls.funds.setValue(
      currentFunds.filter((_: Fund, i: number) => i !== index)
    );

    if (this.editingFundIndex() === index) {
      this.editingFundIndex.set(null);
      this.newFundName.set('');
      this.newFundAmount.set(null);
    }
  }

  protected editFund(index: number): void {
    const fund = this.form.controls.funds.value[index];
    this.newFundName.set(fund.name);
    this.newFundAmount.set(fund.amount);
    this.editingFundIndex.set(index);
  }

  protected cancelEditFund(): void {
    this.editingFundIndex.set(null);
    this.newFundName.set('');
    this.newFundAmount.set(null);
  }

  protected selectTransactionType(value: string): void {
    this.form.controls.transactionType.setValue(value);
    (document.activeElement as HTMLElement)?.blur();
  }
}
