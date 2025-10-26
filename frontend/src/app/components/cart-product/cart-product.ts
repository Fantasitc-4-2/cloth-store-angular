import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-product',
  imports: [],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.css',
})
export class CartProduct {
  @Input() product!: any;
  productDetails: any = {};
  quantity: number = 1;
  @Output() productDeleted = new EventEmitter<string>();
  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.productDetails = this.product.productId;
  }
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  deleteProduct() {
    this.cartService.removeFromCart(this.product._id).subscribe({
      next: (response) => {
        this.productDeleted.emit(this.product._id);
      },
      error: (err) => {
        console.error('Error deleting product from cart:', err);
      },
    });
  }
}
