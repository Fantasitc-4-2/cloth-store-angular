import { Routes } from '@angular/router';
import { Bag } from './bag/bag';
import { Cart } from './cart';
import { Favourites } from './favourites/favourites';

export const CART_ROUTES: Routes = [
  {
    path: '',
    component: Cart,
    children: [
      { path: 'bag', component: Bag },
      { path: '', redirectTo: 'bag', pathMatch: 'full' },
      { path: 'favourites', component: Favourites },
    ],
  },
];
