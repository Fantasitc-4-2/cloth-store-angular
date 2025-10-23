import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct implements OnInit {
  title = '';
  description = '';
  category = '';
  price: number | null = null;
  quantity: number | null = 0;
  cart = '';
  createdBy = '652c1f98d2a4b53a1f8b4569';
  // For multipart upload we store the selected File reference
  imageFile: File | null = null;
  image = '';

  categories: any[] = [];

  uploading = false;
  uploadError: string | null = null;
  submitError: string | null = null;

  // Cloudinary settings - replace with your cloud name and unsigned upload preset
  cloudName = 'your-cloud-name';
  unsignedUploadPreset = 'your-upload-preset';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // fetch categories like the React example
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats || [];
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.imageFile = file;
    // show preview by creating an object URL
    try {
      this.image = URL.createObjectURL(file);
    } catch (e) {
      console.error('Preview generation failed', e);
    }
  }

  submit() {
    this.submitError = null;

    // validation similar to React version
    if (this.title.trim().length < 3 || this.title.trim().length > 100) {
      this.submitError = 'Title must be between 3 and 100 characters';
      return;
    }
    if (this.description.trim().length < 10 || this.description.trim().length > 1000) {
      this.submitError = 'Description must be between 10 and 1000 characters';
      return;
    }
    if (!this.price || isNaN(Number(this.price)) || Number(this.price) < 1) {
      this.submitError = 'Price must be a number >= 1';
      return;
    }
    if (!this.category) {
      this.submitError = 'Category is required';
      return;
    }
    if (!this.imageFile) {
      this.submitError = 'Image is required';
      return;
    }

    // Build FormData to match React implementation
    const form = new FormData();
    form.append('title', this.title.trim());
    form.append('description', this.description.trim());
    form.append('price', String(this.price));
    form.append('category', this.category);
    form.append('createdBy', this.createdBy);
    form.append('quantity', String(this.quantity || 0));
    // sizes/colors could be arrays; append as JSON string
    form.append('sizes', JSON.stringify([]));
    form.append('colors', JSON.stringify([]));
    form.append('image', this.imageFile as Blob);

    this.productService.addProductFormData(form).subscribe({
      next: (p) => {
        console.log('Product created:', p);
        this.router.navigate(['/products', p._id]);
      },
      error: (err) => {
        console.error('Create product failed:', err);
        this.submitError = err?.error?.message || err?.message || 'Create failed';
      }
    });
  }
}
