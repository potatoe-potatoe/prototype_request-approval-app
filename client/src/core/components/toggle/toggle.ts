import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  imports: [],
  templateUrl: './toggle.html',
  host: { style: 'display: inline-flex; align-items: center;' },
})
export class Toggle {
  checked = input(false);
  checkedChange = output<boolean>();
  size = input<'sm' | 'md'>('md');
}
