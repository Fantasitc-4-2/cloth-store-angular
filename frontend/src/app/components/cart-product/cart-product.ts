import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.css',
})
export class CartProduct {
  @Input() product!: any;
  productDetails: any = {};
  quantity: number = 1;
  maxQuantity: number = 999;
  @Output() productDeleted = new EventEmitter<string>();
  @Output() quantityChanged = new EventEmitter<{ productId: string; quantity: number }>();
  updatingQuantity = false;
  constructor(private cartService: CartService) {}
  
  ngOnInit() {
    this.productDetails = this.product.productId;
    // Initialize quantity from cart item
    if (this.product?.quantity) {
      this.quantity = this.product.quantity;
    }
    // Set max quantity from product stock
    if (this.productDetails?.quantity) {
      this.maxQuantity = this.productDetails.quantity;
    }
  }

  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      const newQ = this.quantity + 1;
      this.updateQuantity(newQ);
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      const newQ = this.quantity - 1;
      this.updateQuantity(newQ);
    }
  }

  // Handle direct input
  onQuantityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newQ = parseInt(input.value, 10);
    
    // Validate bounds
    if (isNaN(newQ) || newQ < 1) {
      newQ = 1;
    } else if (newQ > this.maxQuantity) {
      newQ = this.maxQuantity;
    }
    
    if (newQ !== this.quantity) {
      this.updateQuantity(newQ);
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

  private updateQuantity(newQuantity: number) {
    // product.productId is the actual product; backend expects productId in URL for update
    const productId = this.product.productId?._id || this.product.productId;
    if (!productId) return;

    this.updatingQuantity = true;

    this.cartService.updateQuantity(productId, newQuantity).subscribe({
      next: (res) => {
        this.quantity = newQuantity;
        this.updatingQuantity = false;
        this.quantityChanged.emit({ productId, quantity: newQuantity });
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.updatingQuantity = false;
      },
    });
  }
}
