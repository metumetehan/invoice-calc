import { Component, computed, Input, Signal, signal } from '@angular/core';
import { Tax } from '../../models/tax.model';
import { TaxCardComponent } from "./tax-card/tax-card.component";

@Component({
  selector: 'app-tax-list',
  imports: [TaxCardComponent],
  template: `
    <div class="flex gap-4 w-full p-4">
      <div class="flex-2 flex-col gap-4">
        <div class="bg-white shadow-md rounded-lg my-4 p-4 flex justify-between items-center">
          <span class="text-xl font-bold">
            Value
          </span>
          <span class="text-lg font-bold">
          </span>
          <input
            type="text"
            class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
            [value]="withoutTaxes().toFixed(2)"
            readonly
          />
        </div>

        @for (tax of taxes(); track tax.id) {
          <app-tax-card [tax]="tax" [calculatedValue]="tax.rate * withoutTaxes()"></app-tax-card>
        }
        <div class="bg-white shadow-md rounded-lg p-4 my-4 flex justify-between items-center">
          <span class="text-xl font-bold">
            Value before VAT
          </span>
          <span class="text-lg font-bold">
          </span>
          <input
            type="text"
            class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
            [value]="(withoutTaxes()*(1+nTaxRates()+pTaxRates())).toFixed(2)"
            readonly
          />
        </div>
        <app-tax-card [tax]="taxVAT()" [calculatedValue]="taxVAT().rate * withoutTaxes()* (1+pTaxRates())"></app-tax-card>
        <div class="bg-slate-100 p-4 my-4 flex justify-between items-center">
          <span class="text-2xl font-bold">
            All Taxes Inclusive
          </span>
          <input
            type="number"
            class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
            [value]="allTaxesInclusive()"
            (input)="updateAllTaxesInclusive($event)"
            placeholder="Enter Total Amount"
            min="0"
          />
        </div>
      </div>
      <div class="flex-1 flex-col gap-4 mr-0 lg:mr-10">
        <div class="bg-white shadow-md rounded-lg p-4 my-4 flex justify-between items-center">
          <span class="text-xl font-bold">
          Sales amount - Inclusive of all taxes and VAT
          </span>
          <input
            type="text"
            class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
            [value]="allTaxesInclusive().toFixed(2)"
            readonly
            />
        </div>
        <div class="bg-white shadow-md rounded-lg p-4 my-4 flex justify-between items-center">
          <span class="text-xl font-bold">
            Sales amount - Exclusive of all taxes and VAT
          </span>
          <input
            type="text"
            class="border border-gray-300 rounded p-2 text-right w-24 font-bold"
            [value]="withoutTaxes().toFixed(2)"
            readonly
            />
        </div>
      </div>

    </div>
  `,
  styles: ``
})
export class TaxListComponent {
  allTaxesInclusive = signal<number>(0);
  withoutTaxes = signal<number>(0);

  taxVAT = signal<Tax>({ id: 5, title: 'VAT', rate: 0.15, deducted: false });

  taxes = signal<Tax[]>([
    { id: 1, title: 'TL Levy', rate: 0.01, deducted: true },
    { id: 2, title: 'Get Fund Levy', rate: 0.025, deducted: false },
    { id: 3, title: 'Covid Levy', rate: 0.01, deducted: false },
    { id: 4, title: 'NHIL', rate: 0.025, deducted: false },
  ]);

  pTaxRates = computed(() =>
    this.taxes().reduce((sum, tax) => tax.deducted ? sum : sum + tax.rate, 0)
  );

  nTaxRates = computed(() =>
    this.taxes().reduce((sum, tax) => tax.deducted ? sum + tax.rate : sum, 0)
  );



  updateAllTaxesInclusive(event: Event) {
    const inputValue = Number((event.target as HTMLInputElement).value);
    this.allTaxesInclusive.set(inputValue >= 0 ? inputValue : 0);
    this.withoutTaxes.set(inputValue/((this.pTaxRates()+this.nTaxRates()+1)*(1+this.taxVAT().rate)-this.taxVAT().rate*this.nTaxRates()));
  }



}
