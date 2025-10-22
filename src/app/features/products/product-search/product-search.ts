import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CategoryService, Category } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-search',
  imports: [RouterLink,CommonModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch implements OnInit {
   category: Category[] = [];

  constructor(private categoryService: CategoryService) {}

 ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.category = data;
        console.log('Categories loaded:', data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
}
}