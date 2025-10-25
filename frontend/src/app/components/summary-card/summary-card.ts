import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-card',
  imports: [FormsModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css',
})
export class SummaryCard {
  constructor(private router: Router) {}
  isAgreed: boolean = false;
  goToPayment() {
    this.router.navigate(['/checkout']);
  }
}
