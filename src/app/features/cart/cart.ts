import { Component } from '@angular/core';
import { CartProducts } from '../../components/cart-products/cart-products';
import { SummaryCard } from '../../components/summary-card/summary-card';

@Component({
  selector: 'app-cart',
  imports: [CartProducts, SummaryCard],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
