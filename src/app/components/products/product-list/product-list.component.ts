import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `./product-list.component.html`,
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  pages = 1;
  total = 0;
  categories = [
    'All',
    'Rings',
    'Chains',
    'Bangles',
    'Ear Rings',
    'Necklaces',
    'Bracelets',
  ];
  selectedCat = 'All';

  constructor(private svc: ProductService) {}

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(p: number) {
    if (p < 1 || (p > this.pages && this.pages > 0)) return;
    const cat = this.selectedCat === 'All' ? '' : this.selectedCat;
    this.svc.getAll(p, cat).subscribe((res) => {
      this.products = res.products;
      this.page = res.page;
      this.pages = res.pages;
      this.total = res.total;
    });
  }

  filterCat(c: string) {
    this.selectedCat = c;
    this.loadPage(1);
  }

  getThumbnail(p: Product): string {
    return (
      p.media.find((m) => m.isThumbnail && m.resourceType === 'image')?.url ??
      p.media.find((m) => m.resourceType === 'image')?.url ??
      'https://placehold.co/300x300?text=No+Image'
    );
  }

  pageArr(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }
}
