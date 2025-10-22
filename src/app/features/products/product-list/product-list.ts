import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductSearch } from "../product-search/product-search";

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Sidebar, ProductCard, ProductSearch],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList {


  products = [
  {
    title: 'Full Sleeve Zipper',
    category: 'Cotton T Shirt',
    price: 199,
    image: 'images/1.jpg'
  },
  {
    title: 'Basic Slim Fit T-Shirt',
    category: 'Cotton T Shirt',
    price: 129,
    image: 'images/2.jpg'
  },
  {
    title: 'Basic Slim Fit T-Shirt',
    category: 'Cotton T Shirt',
    price: 129,
    image: 'images/3.jpg'
  },
  {
    title: 'Basic Slim Fit T-Shirt',
    category: 'Cotton T Shirt',
    price: 129,
    image: 'images/4.jpg'
  },
  {
    title: 'Basic Slim Fit T-Shirt',
    category: 'Cotton T Shirt',
    price: 129,
    image: 'images/5.jpg'
  }
];


}
