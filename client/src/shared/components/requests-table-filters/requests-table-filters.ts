import { Component, computed, input, signal } from '@angular/core';
import { RequestStatus } from '../../types/request-type';

@Component({
  selector: 'app-requests-table-filters',
  templateUrl: './requests-table-filters.html',
})
export class RequestsTableFilters {
  protected selectedStatuses = signal<Set<string>>(new Set());
  protected searchText = signal('');
  protected selectedStatusesArray = computed(() => [...this.selectedStatuses()]);

  statusOptions = input<RequestStatus[]>([]);

  protected toggleStatus(status: string): void {
    this.selectedStatuses.update(set => {
      const next = new Set(set);

      if (next.has(status)) next.delete(status)
      else next.add(status);

      return next;
    });
  }

  protected isSelectedStatus(status: string): boolean {
    return this.selectedStatuses().has(status);
  }

  protected reset(): void {
    this.selectedStatuses.set(new Set());
    this.searchText.set('');
  }
}
