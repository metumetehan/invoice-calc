import { Component, computed, inject, signal } from '@angular/core';
import { Tax } from '../../models/tax.model';
import { TaxCardComponent } from "./tax-card/tax-card.component";
import { AmountInputComponent } from "../../components/amount-input/amount-input.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tax-list',
  imports: [TaxCardComponent, AmountInputComponent],
  template: `
    <div class="flex gap-4 w-full p-4">
      <div class="flex-2 flex-col gap-4">

        <app-amount-input label="Value" [value]="withoutTaxes()"></app-amount-input>

        @for (tax of taxes(); track tax.id) {
          <app-tax-card [tax]="tax" [calculatedValue]="tax.rate * withoutTaxes()"></app-tax-card>
        }

        <app-amount-input label="Value before VAT" [value]="withoutTaxes() * (1 + nTaxRates() + pTaxRates())"></app-amount-input>


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
        <app-amount-input label="Sales amount - Inclusive of all taxes and VAT" [value]="allTaxesInclusive()"></app-amount-input>
        <app-amount-input label="Sales amount - Exclusive of all taxes and VAT" [value]="withoutTaxes()"></app-amount-input>
      </div>

    </div>
  `,
  styles: ``
})
export class TaxListComponent {
  private http = inject(HttpClient);

  allTaxesInclusive = signal<number>(0);
  withoutTaxes = signal<number>(0);

  taxes = signal<Tax[]>([]);
  taxVAT = signal<Tax>({ id: 1, title: 'VAT', rate: 0.15, deducted: false });
  //taxVAT = signal<Tax | null>(null);

  /*
  taxVAT = signal<Tax>({ id: 1, title: 'VAT', rate: 0.15, deducted: false });

  taxes = signal<Tax[]>([
    { id: 2, title: 'TL Levy', rate: 0.01, deducted: true },
    { id: 3, title: 'Get Fund Levy', rate: 0.025, deducted: false },
    { id: 4, title: 'Covid Levy', rate: 0.01, deducted: false },
    { id: 5, title: 'NHIL', rate: 0.025, deducted: false },
  ]);
  */

  pTaxRates = computed(() =>
    this.taxes().reduce((sum, tax) => tax.deducted ? sum : sum + tax.rate, 0)
  );

  nTaxRates = computed(() =>
    this.taxes().reduce((sum, tax) => tax.deducted ? sum + tax.rate : sum, 0)
  );


  constructor() {
    this.http.get<Tax[]>('http://localhost:5203/api/Tax').subscribe({
      next: (taxesList) => {
        if (taxesList.length > 0) {
          this.taxVAT.set(taxesList[0]); // Set VAT as first element
          this.taxes.set(taxesList.slice(1)); // Remove VAT from the list
        }
      },
      error: (error) => console.error("GET request failed:", error)
    });
    //console.log(this.taxVAT());
    //console.log(this.taxes());
  }


  updateAllTaxesInclusive(event: Event) {
    const inputValue = Number((event.target as HTMLInputElement).value);
    this.allTaxesInclusive.set(inputValue >= 0 ? inputValue : 0);
    this.withoutTaxes.set(inputValue/((this.pTaxRates()+this.nTaxRates()+1)*(1+this.taxVAT().rate)-this.taxVAT().rate*this.nTaxRates()));
  }



}
