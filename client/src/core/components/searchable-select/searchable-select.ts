import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { DropdownOption } from '../../types/input-type';

@Component({
  selector: 'app-searchable-select',
  imports: [],
  templateUrl: './searchable-select.html',
})
export class SearchableSelect<T extends string | number> {
  // TODO: Might need to be an input
  private static readonly PANEL_HEIGHT = 260; // In pixels
  private readonly el = inject(ElementRef<HTMLElement>);

  options = input.required<DropdownOption<T>[]>();
  value = input<T | null>(null);
  valueChange = output<T>();
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

  get selectedLabel(): string {
    const v = this.value();
    return v !== null
      ? (this.options().find(o => o.id === v)?.label ?? '')
      : '';
  }

  get filteredOptions(): DropdownOption<T>[] {
    const searchText = this.search().toLowerCase();
    return searchText
      ? this.options().filter(o => o.label.toLowerCase().includes(searchText))
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

  protected select(id: T): void {
    this.valueChange.emit(id);
    this.search.set('');
    this.isOpen.set(false);
  }
}
