import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-search',
  imports: [RouterLink],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch {

  category = [
  {
    title: 'NEW'
  },
   {
    title: 'SHIRTS'
  }, {
    title: 'JEANS'
  }, {
    title: 'T-SHIRTS'
  }, {
    title: 'FORMAL'
  }, {
    title: 'CASUAL'
  }, {
    title: 'PANTS'
  }, {
    title: 'SHORTS'
  },
];
}
