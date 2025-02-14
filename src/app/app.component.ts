import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TaxListComponent } from "./pages/tax-list/tax-list.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, TaxListComponent],
  template: `
    <app-header />
    <app-tax-list />
  `,
  styles: [],
})
export class AppComponent {
  title = 'invoice-calc';
}
