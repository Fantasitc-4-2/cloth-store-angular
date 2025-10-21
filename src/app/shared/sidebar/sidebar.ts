import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  // Availability
  availabilityOpen = false;

  // Category
  categories = ['NEW', 'BEST SELLERS', 'T-SHIRTS', 'POLO SHIRTS', 'SHORTS'];
  categoryOpen = false;

  // Colors
  colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  colorsOpen = false;
  selectedColor: string | null = null;

  // Price Range
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceRangeOpen = false;

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
    // TODO: wire this up to product list filtering
    console.log('selected category', cat);
  }

  selectColor(col: string) {
    this.selectedColor = col;
    console.log('selected color', col);
  }

  selectCollection(col: string) {
    console.log('selected collection', col);
  }

  selectTag(tag: string) {
    console.log('selected tag', tag);
  }
}
