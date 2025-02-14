import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-input',
  template: `
    <div class="bg-white shadow-md rounded-lg p-4 my-4 flex justify-between items-center">
      <span class="text-xl font-bold">
        {{ label }}
      </span>
      <input
        type="text"
        class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
        [value]="value.toFixed(2)"
        readonly
      />
    </div>
  `,
  styles: ``
})
export class AmountInputComponent {
  @Input() label!: string;
  @Input() value!: number;
}
