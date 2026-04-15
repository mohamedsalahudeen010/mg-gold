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
  template: `
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/products" class="logo"
          ><span class="crown">♛</span
          ><span class="logo-text"> GoldMart</span></a
        >

        <!-- Desktop nav -->
        <div class="nav-right desktop-nav">
          <ng-container *ngIf="auth.isAdmin(); else loginLinkD">
            <span class="admin-badge">{{ auth.adminName() }}</span>
            <a routerLink="/products/new" class="nav-btn add">+ Add Product</a>
            <button class="nav-btn logout" (click)="auth.logout()">
              Logout
            </button>
          </ng-container>
          <ng-template #loginLinkD>
            <a routerLink="/login" class="nav-btn login">Admin Login</a>
          </ng-template>
        </div>

        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="menuOpen = !menuOpen">
          &#9776;
        </button>
      </div>

      <!-- Mobile menu drawer -->
      <div class="mobile-menu" [class.open]="menuOpen">
        <ng-container *ngIf="auth.isAdmin(); else loginLinkM">
          <span class="m-admin">Admin: {{ auth.adminName() }}</span>
          <a
            routerLink="/products/new"
            class="m-link"
            (click)="menuOpen = false"
            >+ Add Product</a
          >
          <button class="m-link" (click)="auth.logout(); menuOpen = false">
            Logout
          </button>
        </ng-container>
        <ng-template #loginLinkM>
          <a routerLink="/login" class="m-link" (click)="menuOpen = false"
            >Admin Login</a
          >
        </ng-template>
      </div>
    </nav>

    <!-- Hero -->
    <div class="hero">
      <h1>Exquisite Gold Jewellery</h1>
      <p>Handcrafted with purity &amp; precision</p>
    </div>

    <!-- Category filter -->
    <div class="cat-bar">
      <button [class.active]="selectedCat === ''" (click)="filterCat('')">
        All
      </button>
      <button
        *ngFor="let c of categories"
        [class.active]="selectedCat === c"
        (click)="filterCat(c)"
      >
        {{ c }}
      </button>
    </div>

    <div class="page-wrap">
      <p class="results-info" *ngIf="total">{{ total }} products found</p>

      <div class="grid">
        <div
          class="card"
          *ngFor="let p of products"
          [routerLink]="['/products', p._id]"
        >
          <div class="card-img-wrap">
            <img
              [src]="getThumbnail(p)"
              [alt]="p.name"
              onerror="this.src='https://placehold.co/300x300/fdf6e3/b8860b?text=No+Image'"
            />
            <span class="karat-badge">{{ p.karat }}K</span>
            <span class="stock-badge low" *ngIf="p.stock > 0 && p.stock < 4"
              >Only {{ p.stock }} left</span
            >
            <span class="stock-badge out" *ngIf="p.stock === 0">Sold Out</span>
            <div
              class="admin-actions"
              *ngIf="auth.isAdmin()"
              (click)="$event.stopPropagation()"
            >
              <a [routerLink]="['/products', p._id, 'edit']" class="action-btn"
                >✏️</a
              >
              <button class="action-btn" (click)="deleteProduct(p._id)">
                🗑️
              </button>
            </div>
          </div>
          <div class="card-body">
            <p class="card-cat">{{ p.category }}</p>
            <h3 class="card-name">{{ p.name }}</h3>
            <div class="card-meta">
              <span>{{ p.weight }}g</span>
              <span>{{ p.hallmark }}</span>
            </div>
            <div class="card-footer">
              <span class="card-price">₹{{ p.price | number }}</span>
              <span class="card-type">{{ p.productType }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="!products.length">
        <span class="empty-icon">♛</span>
        <p>No products found in this category.</p>
        <a *ngIf="auth.isAdmin()" routerLink="/products/new" class="add-btn"
          >+ Add Product</a
        >
      </div>

      <div class="pagination" *ngIf="pages > 1">
        <button (click)="loadPage(page - 1)" [disabled]="page === 1">
          &#8592;
        </button>
        <span
          *ngFor="let n of pageArr()"
          [class.active]="n === page"
          (click)="loadPage(n)"
          >{{ n }}</span
        >
        <button (click)="loadPage(page + 1)" [disabled]="page === pages">
          &#8594;
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      /* ── NAVBAR ── */
      .navbar {
        background: #1a1008;
        padding: 0 24px;
        height: 60px;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .nav-inner {
        height: 60px;
        max-width: 1280px;
        margin: 0 auto;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .logo {
        color: #daa520;
        font-size: 22px;
        font-weight: 700;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .crown {
        font-size: 20px;
      }
      .nav-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .admin-badge {
        color: #daa520;
        font-size: 13px;
      }
      .nav-btn {
        padding: 7px 16px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }
      .nav-btn.add {
        background: #daa520;
        color: #1a1008;
      }
      .nav-btn.logout {
        background: transparent;
        color: #daa520;
        border: 1px solid #daa520;
      }
      .nav-btn.login {
        background: transparent;
        color: #daa520;
        border: 1px solid #daa520;
      }
      .hamburger {
        display: none;
        background: none;
        border: none;
        color: #daa520;
        font-size: 24px;
        cursor: pointer;
      }
      .mobile-menu {
        display: none;
        flex-direction: column;
        background: #1a1008;
        padding: 0;
        max-height: 0;
        overflow: hidden;
        transition:
          max-height 0.3s ease,
          padding 0.3s ease;
      }
      .mobile-menu.open {
        max-height: 240px;
        padding: 12px 24px 16px;
      }
      .m-admin {
        color: #daa520;
        font-size: 13px;
        margin-bottom: 8px;
        display: block;
      }
      .m-link {
        display: block;
        color: #fff;
        text-decoration: none;
        padding: 10px 0;
        font-size: 15px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        width: 100%;
      }

      /* ── HERO ── */
      .hero {
        background: linear-gradient(135deg, #1a1008, #3d2b00, #1a1008);
        color: #daa520;
        text-align: center;
        padding: 48px 24px;
      }
      .hero h1 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }
      .hero p {
        font-size: 15px;
        opacity: 0.75;
      }

      /* ── CATEGORY BAR ── */
      .cat-bar {
        background: #fff;
        border-bottom: 1px solid #f0e6c8;
        padding: 0 24px;
        display: flex;
        overflow-x: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        scrollbar-width: none;
      }
      .cat-bar::-webkit-scrollbar {
        display: none;
      }
      .cat-bar button {
        background: none;
        border: none;
        padding: 14px 18px;
        font-size: 13px;
        font-weight: 500;
        color: #5c4200;
        cursor: pointer;
        white-space: nowrap;
        border-bottom: 3px solid transparent;
        flex-shrink: 0;
      }
      .cat-bar button.active,
      .cat-bar button:hover {
        color: #b8860b;
        border-bottom-color: #b8860b;
      }

      /* ── PAGE ── */
      .page-wrap {
        max-width: 1280px;
        margin: 0 auto;
        padding: 16px 24px 48px;
      }
      .results-info {
        font-size: 13px;
        color: #878787;
        margin-bottom: 12px;
      }

      /* ── GRID — fluid columns ── */
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      /* ── CARD ── */
      .card {
        background: #fff;
        border: 1px solid #f0e6c8;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition:
          box-shadow 0.2s,
          transform 0.2s;
      }
      .card:hover {
        box-shadow: 0 8px 24px rgba(184, 134, 11, 0.18);
        transform: translateY(-3px);
      }
      .card-img-wrap {
        position: relative;
        height: 200px;
        background: #fdf6e3;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .card-img-wrap img {
        max-height: 190px;
        max-width: 100%;
        object-fit: contain;
        transition: transform 0.3s;
      }
      .card:hover .card-img-wrap img {
        transform: scale(1.06);
      }
      .karat-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #b8860b;
        color: #fff;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 3px;
        font-weight: 700;
      }
      .stock-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 10px;
        padding: 3px 7px;
        border-radius: 3px;
        font-weight: 600;
      }
      .stock-badge.low {
        background: #fff3cd;
        color: #856404;
      }
      .stock-badge.out {
        background: #f8d7da;
        color: #721c24;
      }
      .admin-actions {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .card:hover .admin-actions {
        opacity: 1;
      }
      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
      }
      .card-body {
        padding: 12px 14px;
      }
      .card-cat {
        font-size: 11px;
        color: #b8860b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .card-name {
        font-size: 14px;
        color: #1a1008;
        font-weight: 500;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 6px;
      }
      .card-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      .card-meta span {
        font-size: 11px;
        color: #878787;
        background: #fdf6e3;
        padding: 2px 7px;
        border-radius: 3px;
      }
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .card-price {
        font-size: 16px;
        font-weight: 700;
        color: #1a1008;
      }
      .card-type {
        font-size: 11px;
        color: #b8860b;
        text-align: right;
      }

      /* ── EMPTY / PAGINATION ── */
      .empty {
        text-align: center;
        padding: 80px 0;
        color: #878787;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .empty-icon {
        font-size: 48px;
        color: #d0b060;
      }
      .add-btn {
        background: #b8860b;
        color: #fff;
        padding: 10px 24px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 14px;
      }
      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 32px;
        flex-wrap: wrap;
      }
      .pagination button {
        background: #fff;
        border: 1px solid #d0b060;
        padding: 8px 14px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #b8860b;
      }
      .pagination button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .pagination span {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d0b060;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        color: #b8860b;
      }
      .pagination span.active {
        background: #b8860b;
        color: #fff;
      }

      /* ════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ════════════════════════════════════ */

      /* xl: ≥ 1280px — already default above */

      /* lg: 1024–1279px */
      @media (max-width: 1279px) {
        .grid {
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        }
      }

      /* md: 768–1023px (tablets) */
      @media (max-width: 1023px) {
        .hero h1 {
          font-size: 26px;
        }
        .grid {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .page-wrap {
          padding: 12px 16px 40px;
        }
        .cat-bar {
          padding: 0 16px;
        }
      }

      /* sm: 480–767px (large phones) */
      @media (max-width: 767px) {
        .navbar {
          padding: 0 16px;
        }
        .desktop-nav {
          display: none;
        }
        .hamburger {
          display: block;
        }
        .mobile-menu {
          display: flex;
        }
        .hero {
          padding: 32px 16px;
        }
        .hero h1 {
          font-size: 22px;
          letter-spacing: 0.5px;
        }
        .hero p {
          font-size: 14px;
        }
        .cat-bar {
          padding: 0 12px;
        }
        .cat-bar button {
          padding: 12px 14px;
          font-size: 12px;
        }
        .grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .card-img-wrap {
          height: 160px;
        }
        .card-img-wrap img {
          max-height: 150px;
        }
        .card-body {
          padding: 10px 10px;
        }
        .card-name {
          font-size: 13px;
        }
        .card-price {
          font-size: 14px;
        }
        .page-wrap {
          padding: 12px 12px 40px;
        }
        .logo-text {
          display: none;
        }
      }

      /* xs: < 480px (small phones) */
      @media (max-width: 479px) {
        .grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .card-img-wrap {
          height: 140px;
        }
        .card-img-wrap img {
          max-height: 130px;
        }
        .card-body {
          padding: 8px;
        }
        .card-cat {
          font-size: 10px;
        }
        .card-name {
          font-size: 12px;
          -webkit-line-clamp: 2;
        }
        .card-meta {
          gap: 4px;
        }
        .card-meta span {
          font-size: 10px;
          padding: 1px 5px;
        }
        .card-price {
          font-size: 13px;
        }
        .card-type {
          display: none;
        }
        .karat-badge {
          font-size: 10px;
          padding: 2px 5px;
        }
        .hero h1 {
          font-size: 18px;
        }
      }
    `,
  ],
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
