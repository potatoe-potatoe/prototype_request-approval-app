import { Directive, ElementRef, HostListener } from '@angular/core';

// Switches a DaisyUI `.dropdown` to open upward when there isn't enough space
// below it in the viewport. Apply to the `.dropdown` wrapper element.
@Directive({
  selector: '[appDropdownAutoPosition]',
  standalone: true,
})
export class DropdownAutoPosition {
  // Approximate max rendered height of the dropdown content panel (search input
  // ~36px + max-h-48 list 192px + padding) — used as the threshold.
  private static readonly CONTENT_HEIGHT = 260;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('focusin')
  onFocusIn(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < DropdownAutoPosition.CONTENT_HEIGHT) {
      this.el.nativeElement.classList.add('dropdown-top');
    } else {
      this.el.nativeElement.classList.remove('dropdown-top');
    }
  }
}
