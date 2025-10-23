import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { ProductList } from './features/products/product-list/product-list';
import { Profile } from './features/profile/profile';
import { AuthGuard } from './core/guards/auth.guard';
import { ProductDetails } from './features/products/product-details/product-details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'products/add',
    loadComponent: () => import('./features/products/add-product/add-product').then(m => m.AddProduct)
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetails,
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },
];
