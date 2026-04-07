import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'products/new',
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
    loadComponent: () =>
      import('./components/products/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
];
