import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  sizes = ['XS', 'S', 'M', 'L', 'XL', '2X'];
  selectedSizes: string[] = [];

  // Availability
  availabilityOpen = false;
  availability: boolean | null = null; // null = any, true = in stock, false = out

  // Category
  categories = ['NEW', 'BEST SELLERS', 'T-SHIRTS', 'POLO SHIRTS', 'SHORTS'];
  selectedCategory: string | null = null;
  categoryOpen = false;

  // Colors
  colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  colorsOpen = false;
  selectedColors: string[] = [];

  // Price Range
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceRangeOpen = false;

  @Output() filtersChange = new EventEmitter<any>();

  // Collections
  collections = ['Summer', 'Winter', 'Sale'];
  collectionsOpen = false;

  // Tags
  tags = ['new', 'hot', 'limited', 'eco'];
  tagsOpen = false;

  // Ratings
  ratingsOpen = false;
  selectedRating: number | null = null;

  toggleAvailability() {
    this.availabilityOpen = !this.availabilityOpen;
  }

  toggleCategory() {
    this.categoryOpen = !this.categoryOpen;
  }

  toggleColors() {
    this.colorsOpen = !this.colorsOpen;
  }

  togglePriceRange() {
    this.priceRangeOpen = !this.priceRangeOpen;
  }

  toggleCollections() {
    this.collectionsOpen = !this.collectionsOpen;
  }

  toggleTags() {
    this.tagsOpen = !this.tagsOpen;
  }

  toggleRatings() {
    this.ratingsOpen = !this.ratingsOpen;
  }

  // Selection handlers (placeholder implementations)
  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.emitFilters();
  }

  selectColor(col: string) {
    const idx = this.selectedColors.indexOf(col);
    if (idx === -1) this.selectedColors.push(col);
    else this.selectedColors.splice(idx, 1);
    this.emitFilters();
  }

  selectCollection(col: string) {
    // placeholder - not used yet
    this.emitFilters();
  }

  selectTag(tag: string) {
    // placeholder - not used yet
    this.emitFilters();
  }

  toggleSize(size: string) {
    const idx = this.selectedSizes.indexOf(size);
    if (idx === -1) this.selectedSizes.push(size);
    else this.selectedSizes.splice(idx, 1);
    this.emitFilters();
  }

  setAvailability(avail: boolean | null) {
    this.availability = avail;
    this.emitFilters();
  }

  applyPriceRange() {
    this.emitFilters();
  }

  onRatingChange() {
    this.emitFilters();
  }

  emitFilters() {
    const filters = {
      sizes: this.selectedSizes.length ? this.selectedSizes : undefined,
      availability: this.availability ?? undefined,
      colors: this.selectedColors.length ? this.selectedColors : undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      rating: this.selectedRating ?? undefined,
      category: this.selectedCategory ?? undefined
    };
    this.filtersChange.emit(filters);
  }

  clearFilters() {
    this.selectedSizes = [];
    this.selectedColors = [];
    this.availability = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRating = null;
    this.selectedCategory = null;
    this.emitFilters();
  }
}
