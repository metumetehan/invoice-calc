import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-amount-input',
  imports: [],
  template: `
    <input
      class="w-20 h-20 text-center border border-gray-300 rounded-lg text-xl font-bold"
      type="number"
      [value]="amount"
      (input)="onAmountChange($event)"
      placeholder="0"
    />
  `,
  styles: ``
})
export class AmountInputComponent {

  @Input() amount: number = 0;
  @Output() amountChange = new EventEmitter<number>();

  onAmountChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.amountChange.emit(Number(inputValue));
  }

}
