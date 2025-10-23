import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CategoryService, Category } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch implements OnInit {
  @Input() searchTerm: string = '';
  @Input() selectedCategory: string = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

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

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onCategoryClick(categoryId: string): void {
    this.categoryChange.emit(categoryId);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
