import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-card',
  imports: [FormsModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css',
})
export class SummaryCard {
  @Input() subTotal: number = 0;
  total: number = 0;
  constructor(private router: Router) {}
  isAgreed: boolean = false;
  ngOnChanges() {
    this.total = this.subTotal + 10;
  }
  goToPayment() {
    this.router.navigate(['/checkout']);
  }
}
