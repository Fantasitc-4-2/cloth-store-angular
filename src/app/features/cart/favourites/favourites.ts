import { Component } from '@angular/core';
import { WishlistItems } from '../../../components/wishlist-items/wishlist-items';

@Component({
  selector: 'app-favourites',
  imports: [WishlistItems],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites {}
