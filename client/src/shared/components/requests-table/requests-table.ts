import { Component, input, output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requests-table',
  templateUrl: './requests-table.html',
  styleUrl: './requests-table.css',
  host: { class: 'flex flex-col flex-1 min-h-0 gap-2' },
  imports: [RouterLink, DatePipe],
})
export class RequestsTable {
  requests = input<any[]>([]); // TODO: Do not use 'any'
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  pageSize = input<number>(10);
  totalItems = input<number>(0);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly pageSizeOptions = [10, 20, 50, 100];

  protected changePageSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }

  protected goToPrevPage(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  protected goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  protected hasPrevPage(): boolean {
    return this.currentPage() > 1;
  }

  protected hasNextPage(): boolean {
    return this.currentPage() < this.totalPages();
  }

  protected buildLink(id: string): string {
    return `/requests/${id}`;
  }
}
