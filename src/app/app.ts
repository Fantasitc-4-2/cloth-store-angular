import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductDetails } from "./features/products/product-details/product-details";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductDetails],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cloth-store');
}
