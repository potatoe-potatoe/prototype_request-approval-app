import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  imports: [],
  templateUrl: './searchable-select.html',
})
export class SearchableSelect {
  private static readonly PANEL_HEIGHT = 260;

  private readonly el = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) options: string[] = [];
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() placeholder = 'Select option';
  @Input() size: 'sm' | 'md' = 'md';

  protected search = signal('');
  protected isOpen = signal(false);
  protected panelStyle = signal<Record<string, string>>({});

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  get filteredOptions(): string[] {
    const q = this.search().toLowerCase();
    return q ? this.options.filter(o => o.toLowerCase().includes(q)) : this.options;
  }

  protected open(trigger: HTMLElement): void {
    if (this.isOpen()) { this.isOpen.set(false); return; }
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    this.panelStyle.set({
      position: 'fixed',
      ...(spaceBelow >= SearchableSelect.PANEL_HEIGHT
        ? { top: `${rect.bottom}px` }
        : { bottom: `${window.innerHeight - rect.top}px` }),
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    });
    this.isOpen.set(true);
  }

  protected select(option: string): void {
    this.valueChange.emit(option);
    this.search.set('');
    this.isOpen.set(false);
  }
}
