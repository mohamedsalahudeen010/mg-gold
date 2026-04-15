import { Routes } from '@angular/router';
import { authGuard } from './core/gaurds/auth.gaurd';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: 'products/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
];
