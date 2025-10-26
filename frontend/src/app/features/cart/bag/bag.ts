import { Component, OnInit } from '@angular/core';
import { CartProducts } from '../../../components/cart-products/cart-products';
import { SummaryCard } from '../../../components/summary-card/summary-card';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-bag',
  imports: [CartProducts, SummaryCard],
  templateUrl: './bag.html',
  styleUrl: './bag.css',
})
export class Bag implements OnInit {
  cartItems: any[] = [];
  subTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.cartUser.items;
        console.log('Cart items:', data.cartUser);
        this.subTotal = data.cartUser.totalPrice;
      },
      error: (err) => console.error('Error fetching cart products:', err),
    });
  }
}
