import { Component, input, model, output } from '@angular/core';
import { RequestFilters, RequestStatus } from '../../types/request-type';

@Component({
  selector: 'app-requests-table-filters',
  templateUrl: './requests-table-filters.html',
  host: { '(keydown.enter)': 'apply()' },
})
export class RequestsTableFilters {
  statusOptions = input<RequestStatus[]>([]);
  searchText = model('');
  selectedStatuses = model<RequestStatus[]>([]);

  readonly filtersApplied = output<RequestFilters>();
  readonly filtersReset = output<void>();

  // ----------------------------------------
  //  Status filter
  // ----------------------------------------
  protected showStatusFilter(): boolean {
    return this.statusOptions().length > 0;
  }

  /**
   * Programatically closes the dropdown.
   * When a checklist item inside the multiselect status dropdown
   *  is selected, it moves the focus to the dropdown, assigning
   *  it as the current active element.
   * The code below removes focus from the active element.
   */
  protected closeStatusDropdown(): void {
    (document.activeElement as HTMLElement)?.blur();
  }

  protected allStatusSelected(): boolean {
    return this.statusOptions().length > 0 &&
      this.selectedStatuses().length === this.statusOptions().length;
  }

  protected someStatusSelected(): boolean {
    return this.selectedStatuses().length > 0 && !this.allStatusSelected();
  }

  protected toggleAll(): void {
    if (this.allStatusSelected()) {
      this.selectedStatuses.set([]);
    } else {
      this.selectedStatuses.set([...this.statusOptions()]);
    }
  }

  protected isSelectedStatus(status: RequestStatus): boolean {
    return this.selectedStatuses().includes(status);
  }

  protected toggleStatus(status: RequestStatus): void {
    const current = this.selectedStatuses();
    const next = this.isSelectedStatus(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    this.selectedStatuses.set(next);
  }

  // ----------------------------------------
  //  Search filter
  // ----------------------------------------
  protected onSearchInput(event: Event): void {
    setTimeout(() => {
      this.searchText.set((event.target as HTMLInputElement).value);
    }, 150);
  }

  // ----------------------------------------
  //  Buttons
  // ----------------------------------------
  protected apply(): void {
    const filters: RequestFilters = { searchText: this.searchText() };
    if (this.showStatusFilter()) {
      filters.statusList = this.selectedStatuses();
    }
    this.filtersApplied.emit(filters);
  }

  protected reset(): void {
    this.filtersReset.emit();
  }
}
