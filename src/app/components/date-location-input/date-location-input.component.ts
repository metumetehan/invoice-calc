import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-location-input',
  template: `
    <div class="flex flex-col gap-4 max-w-sm mx-auto p-4 border rounded-lg shadow-lg bg-white">

      <label for="date" class="font-bold">Select Date:</label>
      <input type="date" id="date" [value]="date()" (input)="updateDate($event)" class="p-2 border rounded-md">

      <label for="country" class="font-bold">Select Country:</label>
      <select id="country" [value]="selectedCountry()" (change)="onCountryChange($event)" class="p-2 border rounded-md">
        @for (country of countries(); track country) {
          <option [value]="country">{{ country }}</option>
        }
      </select>

      <label for="cityOrState" class="font-bold">Select City/State:</label>
      <select id="cityOrState" [value]="selectedCityOrState()" (change)="onCityChange($event)" class="p-2 border rounded-md">
        @for (location of citiesOrStates(); track location) {
          <option [value]="location">{{ location }}</option>
        }
      </select>

      <button type="button" (click)="submitForm()" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700">
        Fetch Tax Laws
      </button>

    </div>
  `,
  styles: ``
})
export class DateLocationInputComponent {
  private fb = inject(FormBuilder);

  @Output() requestUrl = new EventEmitter<string>();

  date = signal('');
  selectedCountry = signal('USA');
  selectedCityOrState = signal('New York');

  countries = signal(['USA', 'Canada', 'UK', 'Germany', 'France', 'Turkey']);
  locationsByCountry = signal<Record<string, string[]>>({
    USA: ['New York', 'California', 'Texas', 'Florida'],
    Canada: ['Toronto', 'Vancouver', 'Montreal'],
    UK: ['London', 'Manchester', 'Birmingham'],
    Germany: ['Berlin', 'Munich', 'Hamburg'],
    France: ['Paris', 'Lyon', 'Marseille'],
    Turkey: ['İstanbul', 'Ankara', 'İzmir']
  });

  citiesOrStates = signal(this.locationsByCountry()[this.selectedCountry()]);

  constructor() {}

  updateDate(event: Event) {
    this.date.set((event.target as HTMLInputElement).value);
  }

  onCountryChange(event: Event) {
    const newCountry = (event.target as HTMLSelectElement).value;
    this.selectedCountry.set(newCountry);
    this.citiesOrStates.set(this.locationsByCountry()[newCountry]);
    this.selectedCityOrState.set(this.citiesOrStates()[0]);
  }

  onCityChange(event: Event) {
    this.selectedCityOrState.set((event.target as HTMLSelectElement).value);
  }

  submitForm() {
    const url = `http://localhost:5203/api/Tax/filtered?date=${this.date()}&country=${this.selectedCountry()}&cityOrState=${this.selectedCityOrState()}`;

    console.log("Generated Request URL:", url);

    // Emit the request URL to TaxListComponent
    this.requestUrl.emit(url);
  }
}
