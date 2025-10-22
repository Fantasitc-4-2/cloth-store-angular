import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductSearch } from "../product-search/product-search";
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Sidebar, ProductCard, ProductSearch],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit{



 products: Product[] = [];

 constructor(private productService: ProductService,private router: Router) {}
ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded:', data);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  goToProduct(id?: string) {
  if (!id) {
    console.error('Product ID is missing!');
    return;
  }
  this.router.navigate(['/products', id]);
}


}
