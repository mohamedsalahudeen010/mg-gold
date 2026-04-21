import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, GOLD_CATEGORIES } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  pages = 1;
  total = 0;
  categories = GOLD_CATEGORIES;
  selectedCat = '';
  menuOpen = false;

  constructor(
    public auth: AuthService,
    private svc: ProductService,
  ) {}
  ngOnInit() {
    this.loadPage(1);
  }

  @HostListener('document:click', ['$event'])
  closeMenu(e: Event) {
    if (!(e.target as HTMLElement).closest('.navbar')) this.menuOpen = false;
  }

  loadPage(p: number) {
    if (p < 1 || (this.pages > 0 && p > this.pages)) return;
    this.svc.getAll(p, this.selectedCat).subscribe((res) => {
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
      p.images.find((i) => i.isThumbnail)?.url ??
      p.images[0]?.url ??
      'https://placehold.co/300x300/fdf6e3/b8860b?text=No+Image'
    );
  }
  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.svc.deleteProduct(id).subscribe(() => this.loadPage(this.page));
  }
  pageArr() {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }
}
