import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  imports: [],
  templateUrl: './searchable-select.html',
})
export class SearchableSelect {
  // TODO: Might need to be an input
  private static readonly PANEL_HEIGHT = 260; // In pixels
  private readonly el = inject(ElementRef<HTMLElement>);

  options = input.required<string[]>();
  value = input('');
  valueChange = output<string>();
  placeholder = input('Select option');
  size = input<'sm' | 'md'>('md');

  protected search = signal('');
  protected isOpen = signal(false);
  protected panelStyle = signal<Record<string, string>>({});

  @HostListener('document:click', ['$event.target'])
  closeDropdown(target: EventTarget | null): void {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen.set(false);
      this.search.set('');
    }
  }

  get filteredOptions(): string[] {
    const searchText = this.search().toLowerCase();
    return searchText
      ? this.options().filter(o => o.toLowerCase().includes(searchText))
      : this.options();
  }

  protected open(trigger: HTMLElement): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    this.panelStyle.set({
      position: 'fixed',
      ...(spaceBelow >= SearchableSelect.PANEL_HEIGHT
        ? { top: `${rect.bottom}px` }
        : { bottom: `${window.innerHeight - rect.top}px` }
      ),
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
