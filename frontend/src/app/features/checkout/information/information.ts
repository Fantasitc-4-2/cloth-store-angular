import { Component } from '@angular/core';

@Component({
  selector: 'app-information',
  imports: [],
  templateUrl: './information.html',
  styleUrl: './information.css',
})
export class Information {
  products: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    size: string;
    color: string;
    img: string;
  }> = [
    {
      id: 1,
      name: 'Sample Product',
      category: 'Shirts',
      price: 29.99,
      size: 'M',
      color: 'Red',
      img: '/Rectangle 3.png',
    },
    {
      id: 2,
      name: 'Sample Product',
      category: 'Shirts',
      price: 40.99,
      size: 'L',
      color: 'Blue',
      img: '/Rectangle 3.png',
    },
  ];
}
