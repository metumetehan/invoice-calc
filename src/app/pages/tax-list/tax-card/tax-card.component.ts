import { Component, Input } from '@angular/core';
import { Tax } from '../../../models/tax.model';

@Component({
  selector: 'app-tax-card',
  imports: [],
  template: `
    <div class="bg-yellow-100 shadow-md rounded-lg p-4 my-1 flex justify-between items-center">
      <span class="text-xl font-bold flex-1">
        {{ tax.title }}
      </span>
      <span class="text-lg font-bold flex-1">
        {{ (tax.rate * 100).toFixed(2) }}%
      </span>
      <input
        type="text"
        class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
        [value]="calculatedValue.toFixed(2)"
        readonly
      />
    </div>
  `,
  styles: ``
})
export class TaxCardComponent {
  @Input({ required: true }) tax!: Tax;
  @Input({ required: true }) calculatedValue!: number;

}
