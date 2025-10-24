import { Component } from '@angular/core';
import { CartProducts } from '../../../components/cart-products/cart-products';
import { SummaryCard } from '../../../components/summary-card/summary-card';

@Component({
  selector: 'app-bag',
  imports: [CartProducts, SummaryCard],
  templateUrl: './bag.html',
  styleUrl: './bag.css',
})
export class Bag {}
