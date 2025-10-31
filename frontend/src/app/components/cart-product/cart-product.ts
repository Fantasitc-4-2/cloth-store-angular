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

    if (this.product && typeof this.product.quantity === 'number') {
      this.quantity = this.product.quantity;
    }
  }

  increaseQuantity() {
    this.quantity++;
    this.updateCartQuantity();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateCartQuantity();
    }
  }

  private updateCartQuantity() {
    // Get the actual product ID from the populated productId field
    const productId = this.productDetails?._id || this.productDetails?.id;

    if (productId) {
      // Use addToCart with the new total quantity
      this.cartService.addToCart(productId, this.quantity).subscribe({
        next: (response) => {
          this.product.quantity = this.quantity;
          console.log('Cart updated successfully');
        },
        error: (err) => {
          console.error('Error updating cart quantity:', err);
          // Revert quantity on error
          this.quantity = this.product.quantity || 1;
        },
      });
    } else {
      console.error('Product ID not found');
      // Revert quantity
      this.quantity = this.product.quantity || 1;
    }
  }

  deleteProduct() {
    // Use the cart item's _id for deletion
    const cartItemId = this.product._id;

    if (cartItemId) {
      this.cartService.removeFromCart(cartItemId).subscribe({
        next: (response) => {
          console.log('Product deleted successfully');
          this.productDeleted.emit(cartItemId);
        },
        error: (err) => {
          console.error('Error deleting product from cart:', err);
        },
      });
    } else {
      console.error('Cart item ID not found');
    }
  }
}
