import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { amountOptions, EditDraftRequest, Fund, ReviewType, reviewTypes, TransactionType } from '../../../shared/types/request-type';
import { mockApprovalMatrix, mockApprovers, mockEditDraftRequest, mockTransactionTypes } from '../../../mock-data';
import { CommentEditor } from '../../../shared/components/comment-editor/comment-editor';
import { ApprovalReference, ApprovalStep } from '../../../shared/types/approval-type';
import { SearchableSelect } from '../../../core/components/searchable-select/searchable-select';
import { Toggle } from '../../../core/components/toggle/toggle';
import { ApprovalStepRow } from './approval-step-row/approval-step-row';
import { DropdownOption } from '../../../core/types/input-type';
import { ActivatedRoute } from '@angular/router';

enum InputMode {
  Create = 'create',
  Edit = 'edit'
}

@Component({
  selector: 'app-create-request',
  imports: [DecimalPipe, CommentEditor, ReactiveFormsModule, SearchableSelect, Toggle, ApprovalStepRow],
  templateUrl: './create-request.html',
})
export class CreateRequest implements OnInit {
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(ActivatedRoute);

  protected readonly reviewTypeOptions = reviewTypes;
  protected readonly amountRangeOptions = amountOptions;
  protected readonly form = this.fb.group({
    subject: ['', [Validators.required]],
    reviewType: [ReviewType.Contract as ReviewType | null],
    reviewTypeOther: [''],
    vendor: [''],
    transactionTypeId: this.fb.control<number | null>(null),
    amountRange: [''],
    funds: this.fb.nonNullable.control<Fund[]>([]),
    comment: this.fb.group({
      text: [''],
      references: this.fb.nonNullable.control<ApprovalReference[]>([]),
    }),
    initialApprovers: this.fb.group({
      directManagerId: this.fb.control<number | null>(null),
      sponsorId: this.fb.control<number | null>(null),
    }),
  });

  protected transactionTypes = signal<TransactionType[]>([]);
  protected approverOptions = signal<DropdownOption<number>[]>([]);
  protected approvalMatrix = signal<ApprovalStep[]>([]);

  protected newFundName = signal('');
  protected newFundAmount = signal<number | null>(null);
  protected editingFundIndex = signal<number | null>(null);

  protected includeDirectManager = signal(false);
  protected includeSponsor = signal(false);

  protected mode = signal<InputMode>(InputMode.Create);
  protected request = signal<EditDraftRequest | null>(null);

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    this.setEditMode(id);

    this.loadDropdownData();
    this.loadApprovalMatrix();
  }

  // TODO: Fetch from the backend
  private loadDropdownData(): void {
    this.transactionTypes.set(mockTransactionTypes);
    this.approverOptions.set(mockApprovers.map(
      a => ({ id: a.id, label: a.name }))
    );
  }

  // TODO: Fetch from the backend
  private loadApprovalMatrix(): void {
    this.approvalMatrix.set(mockApprovalMatrix.slice(1));
  }

  protected goBack(): void {
    this.location.back();
  }

  // TODO: Update logic for saving
  protected saveDraft(): void {
    const json = JSON.stringify(this.form.value, null, 2);
    console.log(`Save Draft :: ${json}`);
  }

  // TODO: Update logic for submitting
  protected submitForApproval(): void {
    const json = JSON.stringify(this.form.value, null, 2);
    console.log(`Submit for Approval :: ${json}`);
  }

  /**
   * Check if the "direct manager" toggle is checked/enabled or not.
   * @param isToggled - The state of the toggle.
   */
  protected toggleDirectManager(isToggled: boolean): void {
    this.includeDirectManager.set(isToggled);
    if (!isToggled) this.form.controls.initialApprovers.controls.directManagerId.setValue(null);
    
  }

  /**
   * Check if the "sponsor" toggle is checked/enabled or not.
   * @param isToggled - The state of the toggle.
   */
  protected toggleSponsor(isToggled: boolean): void {
    this.includeSponsor.set(isToggled);
    if (!isToggled) this.form.controls.initialApprovers.controls.sponsorId.setValue(null);
  }

  get approverFormGroup() {
    return this.form.controls.initialApprovers;
  }

  get isOthersSelected(): boolean {
    return this.form.controls.reviewType.value === ReviewType.Others;
  }

  /**
   * Updates the currently selected ReviewType.
   * 
   * @param type - The selected ReviewType.
   */
  protected selectReviewType(type: ReviewType): void {
    this.form.controls.reviewType.setValue(type);
    if (type !== ReviewType.Others) {
      this.form.controls.reviewTypeOther.setValue('');
    }
  }

  /**
   * Checks if both the fund name and amount fields are populated.
   * 
   * @returns Whether there is valid fund input (true) or not (false).
   */
  protected hasFundInput(): boolean {
    const name = this.newFundName().trim();
    const amount = this.newFundAmount();
    const hasName = (name && name.length > 0) as boolean;
    const hasAmount = !!amount as boolean;
    return hasName && hasAmount;
  }

  /**
   * Adds a fund to the funds form control.
   * If the fund is already in the list, then it is updated.
   */
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

  /**
   * Updates an existing fund entry in the funds form control.
   * 
   * @param index - The position of the fund in the list.
   * @param name - The new name of the fund.
   * @param amount - The new amount of the fund.
   */
  private updateFund(index: number, name: string, amount: number): void {
    const currentFunds = this.form.controls.funds.value;
    this.form.controls.funds.setValue(
      currentFunds.map((f, i) => i === index ? { name, amount }: f)
    );
    this.editingFundIndex.set(null);
  }

  /**
   * Removes the fund from the funds form control.
   * 
   * @param index - The position of the fund in the list.
   */
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

  /**
   * Populates the fund name and amount form fields.
   * This is triggered when the user clicks the 'edit' button for the fund.
   * 
   * @param index - The position of the fund in the list.
   */
  protected editFund(index: number): void {
    const fund = this.form.controls.funds.value[index];
    this.newFundName.set(fund.name);
    this.newFundAmount.set(fund.amount);
    this.editingFundIndex.set(index);
  }

  /**
   * Discards the changes to the selected fund for editing.
   * This is triggered when the user clicks the 'cancel' button for the fund.
   */
  protected cancelEditFund(): void {
    this.editingFundIndex.set(null);
    this.newFundName.set('');
    this.newFundAmount.set(null);
  }

  /**
   * Updates the currently selected TransactionTypeId.
   * 
   * @param id - The id of the TransactionType.
   */
  protected selectTransactionType(id: number): void {
    this.form.controls.transactionTypeId.setValue(id);
    (document.activeElement as HTMLElement)?.blur();
  }

  get selectedTransactionTypeName(): string {
    const id = this.form.controls.transactionTypeId.value;
    if (id == null) return '';
    return this.findTransactionTypeName(this.transactionTypes(), id) ?? '';
  }

  /**
   * Gets the name of a TransactionType by recursively searching the TransactionType tree.
   * 
   * @param types - A nested list of TransactionTypes.
   * @param id - The id of the searched TransactionType.
   * @returns The name of the searched TransactionType.
   */
  private findTransactionTypeName(types: TransactionType[], id: number): string | undefined {
    for (const t of types) {
      if (t.id === id) return t.name;
      const found = this.findTransactionTypeName(t.children, id);
      if (found) return found;
    }
    return undefined;
  }

  // ----------------------------------------
  //  Mode: Edit
  // ----------------------------------------
  get isEditMode(): boolean {
    return this.mode() === InputMode.Edit;
  }

  private setEditMode(id: string | null): void {
    if (!id) return;
    this.mode.set(InputMode.Edit);
    this.loadRequest();
  }

  // TODO: Fetch from the backend
  private loadRequest(): void {
    // <endpoint>.subcscribe({
    //   next: request => {
    //     set request
    //     set form
    //     set toggles
    //   }
    // });
    this.request.set(mockEditDraftRequest);
    this.initFormData(mockEditDraftRequest);
    this.initToggles(mockEditDraftRequest);
  }

  private initFormData(request: EditDraftRequest): void {
    this.form.patchValue({
      subject: request.subject,
      reviewType: request.reviewType,
      reviewTypeOther: request.reviewTypeOther,
      vendor: request.vendor,
      transactionTypeId: request.transactionType?.id || null,
      amountRange: request.amountBracket,
      funds: request.funds,
      comment: {
        text: request.comment?.comment || '',
        references: request.comment?.references || [],
      },
      initialApprovers: {
        directManagerId: request.preapproverManager?.id || null,
        sponsorId: request.preapproverSponsor?.id || null,
      }
    });
  }

  private initToggles(request: EditDraftRequest): void {
    if (request.preapproverManager) this.includeDirectManager.set(true);
    if (request.preapproverSponsor) this.includeSponsor.set(true);
  }
}
