import { Component } from '@angular/core';
import { CartProducts } from '../../components/cart-products/cart-products';
import { SummaryCard } from '../../components/summary-card/summary-card';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
