import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="product; else loading">
      <nav class="navbar">
        <div class="nav-inner">
          <a routerLink="/products" class="logo"
            ><span>♛</span><span class="logo-text"> GoldMart</span></a
          >
          <div class="nav-right">
            <ng-container *ngIf="auth.isAdmin()">
              <a
                [routerLink]="['/products', product._id, 'edit']"
                class="nav-btn edit"
                >✏️ Edit</a
              >
              <button class="nav-btn logout" (click)="auth.logout()">
                Logout
              </button>
            </ng-container>
            <a *ngIf="!auth.isAdmin()" routerLink="/login" class="nav-btn login"
              >Admin Login</a
            >
          </div>
        </div>
      </nav>

      <div class="breadcrumb">
        <a routerLink="/products">Home</a> ›
        <span>{{ product.category }}</span> ›
        <span class="current">{{ product.name }}</span>
      </div>

      <div class="detail-wrap">
        <!-- LEFT: media -->
        <div class="media-col">
          <div class="sticky-media">
            <div class="carousel">
              <button
                class="arr left"
                (click)="prev()"
                [disabled]="product.images.length <= 1"
              >
                &#8249;
              </button>
              <div class="carousel-inner">
                <div
                  class="slide"
                  *ngFor="let img of product.images; let i = index"
                  [class.active]="i === idx"
                >
                  <img [src]="img.url" [alt]="img.originalName" />
                </div>
                <div class="no-img" *ngIf="!product.images.length">
                  No images available
                </div>
              </div>
              <button
                class="arr right"
                (click)="next()"
                [disabled]="product.images.length <= 1"
              >
                &#8250;
              </button>
              <div class="dots" *ngIf="product.images.length > 1">
                <span
                  *ngFor="let img of product.images; let i = index"
                  [class.active]="i === idx"
                  (click)="idx = i"
                ></span>
              </div>
            </div>
            <div class="thumbs" *ngIf="product.images.length > 1">
              <div
                *ngFor="let img of product.images; let i = index"
                class="thumb"
                [class.active]="i === idx"
                (click)="idx = i"
              >
                <img [src]="img.url" [alt]="img.originalName" />
              </div>
            </div>
            <div class="video-section" *ngIf="product.video">
              <p class="vid-label">Product Video</p>
              <video
                [src]="product.video.url"
                controls
                playsinline
                preload="metadata"
                class="video"
              ></video>
            </div>
          </div>
        </div>

        <!-- RIGHT: info -->
        <div class="info-col">
          <p class="info-cat">{{ product.category }}</p>
          <h1 class="info-name">{{ product.name }}</h1>
          <p class="info-type">{{ product.productType }}</p>
          <div class="price-row">
            <span class="price">₹{{ product.price | number }}</span>
            <span class="tax-note">Inclusive of all taxes</span>
          </div>
          <div class="specs">
            <div class="spec-item">
              <span class="spec-label">Karat</span>
              <span class="spec-val">{{ product.karat }}K Gold</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Weight</span>
              <span class="spec-val">{{ product.weight }}g</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Hallmark</span>
              <span class="spec-val">{{ product.hallmark }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Availability</span>
              <span
                class="spec-val"
                [class.green]="product.stock > 0"
                [class.red]="product.stock === 0"
              >
                {{
                  product.stock > 0
                    ? 'In Stock (' + product.stock + ' pcs)'
                    : 'Out of Stock'
                }}
              </span>
            </div>
          </div>
          <div class="actions" *ngIf="product.stock > 0">
            <button class="btn-cart">🛒 Add to Cart</button>
            <button class="btn-buy">Buy Now</button>
          </div>
          <div class="purity-badge">
            <span>✓</span> BIS Certified &nbsp;|&nbsp; <span>✓</span> Hallmarked
            &nbsp;|&nbsp; <span>✓</span> Lifetime Exchange
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #loading>
      <div class="loading"><div class="spinner"></div></div>
    </ng-template>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .navbar {
        background: #1a1008;
        padding: 0 24px;
        height: 60px;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .logo {
        color: #daa520;
        font-size: 20px;
        font-weight: 700;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .nav-right {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .nav-btn {
        padding: 7px 14px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }
      .nav-btn.edit {
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
      .breadcrumb {
        background: #fff;
        padding: 10px 24px;
        font-size: 12px;
        color: #878787;
        border-bottom: 1px solid #f0e6c8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .breadcrumb a {
        color: #878787;
        text-decoration: none;
      }
      .breadcrumb a:hover {
        color: #b8860b;
      }
      .breadcrumb .current {
        color: #1a1008;
      }

      /* ── LAYOUT ── */
      .detail-wrap {
        max-width: 1280px;
        margin: 0 auto;
        padding: 24px;
        display: flex;
        gap: 32px;
        align-items: flex-start;
      }
      .media-col {
        width: 420px;
        flex-shrink: 0;
      }
      .sticky-media {
        position: sticky;
        top: 76px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      /* ── CAROUSEL ── */
      .carousel {
        position: relative;
        height: 380px;
        background: #fdf6e3;
        border: 1px solid #f0e6c8;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .carousel-inner {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .slide {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .slide.active {
        opacity: 1;
      }
      .slide img {
        max-width: 90%;
        max-height: 360px;
        object-fit: contain;
      }
      .no-img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b8860b;
        font-size: 14px;
      }
      .arr {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #f0e6c8;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 22px;
        cursor: pointer;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b8860b;
      }
      .arr.left {
        left: 8px;
      }
      .arr.right {
        right: 8px;
      }
      .arr:disabled {
        opacity: 0.3;
        cursor: default;
      }
      .dots {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
      }
      .dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d0b060;
        cursor: pointer;
      }
      .dots span.active {
        background: #b8860b;
      }
      .thumbs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .thumbs::-webkit-scrollbar {
        display: none;
      }
      .thumb {
        width: 64px;
        height: 64px;
        border: 2px solid #f0e6c8;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        padding: 4px;
        background: #fdf6e3;
        flex-shrink: 0;
      }
      .thumb.active {
        border-color: #b8860b;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .video-section {
        border: 1px solid #f0e6c8;
        border-radius: 8px;
        overflow: hidden;
        background: #fdf6e3;
        padding: 12px;
      }
      .vid-label {
        font-size: 13px;
        font-weight: 600;
        color: #5c4200;
        margin-bottom: 10px;
      }
      .video {
        width: 100%;
        border-radius: 4px;
        background: #000;
        max-height: 260px;
        display: block;
      }

      /* ── INFO COL ── */
      .info-col {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .info-cat {
        font-size: 12px;
        color: #b8860b;
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .info-name {
        font-size: 24px;
        font-weight: 600;
        color: #1a1008;
        line-height: 1.3;
      }
      .info-type {
        font-size: 14px;
        color: #5c4200;
      }
      .price-row {
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding: 14px 0;
        border-top: 1px solid #f0e6c8;
        border-bottom: 1px solid #f0e6c8;
        flex-wrap: wrap;
      }
      .price {
        font-size: 30px;
        font-weight: 700;
        color: #1a1008;
      }
      .tax-note {
        font-size: 12px;
        color: #878787;
      }
      .specs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .spec-item {
        background: #fdf6e3;
        border: 1px solid #f0e6c8;
        border-radius: 6px;
        padding: 12px 14px;
      }
      .spec-label {
        display: block;
        font-size: 11px;
        color: #b8860b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .spec-val {
        font-size: 14px;
        font-weight: 500;
        color: #1a1008;
      }
      .spec-val.green {
        color: #388e3c;
      }
      .spec-val.red {
        color: #c62828;
      }
      .actions {
        display: flex;
        gap: 12px;
      }
      .btn-cart {
        flex: 1;
        background: #fdf6e3;
        color: #b8860b;
        border: 2px solid #b8860b;
        padding: 13px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-buy {
        flex: 1;
        background: #b8860b;
        color: #fff;
        border: none;
        padding: 13px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }
      .purity-badge {
        background: #fdf6e3;
        border: 1px solid #f0e6c8;
        border-radius: 6px;
        padding: 12px 16px;
        font-size: 13px;
        color: #5c4200;
      }
      .purity-badge span {
        color: #388e3c;
        font-weight: 700;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80vh;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f0e6c8;
        border-top-color: #b8860b;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ════════════════════════════════════ */

      /* lg: 1024–1279px */
      @media (max-width: 1279px) {
        .media-col {
          width: 360px;
        }
        .carousel {
          height: 340px;
        }
      }

      /* md: 768–1023px (tablets) */
      @media (max-width: 1023px) {
        .media-col {
          width: 320px;
        }
        .carousel {
          height: 300px;
        }
        .info-name {
          font-size: 20px;
        }
        .price {
          font-size: 26px;
        }
        .detail-wrap {
          gap: 20px;
          padding: 16px;
        }
      }

      /* sm + md stacked: ≤ 767px */
      @media (max-width: 767px) {
        .detail-wrap {
          flex-direction: column;
          padding: 12px;
          gap: 16px;
        }
        .media-col {
          width: 100%;
        }
        .sticky-media {
          position: static;
        }
        .carousel {
          height: 300px;
        }
        .navbar {
          padding: 0 16px;
        }
        .logo-text {
          display: none;
        }
        .specs {
          grid-template-columns: 1fr 1fr;
        }
        .actions {
          flex-direction: column;
        }
        .btn-cart,
        .btn-buy {
          width: 100%;
        }
      }

      /* xs: < 480px */
      @media (max-width: 479px) {
        .carousel {
          height: 240px;
        }
        .slide img {
          max-height: 220px;
        }
        .thumb {
          width: 52px;
          height: 52px;
        }
        .info-name {
          font-size: 18px;
        }
        .price {
          font-size: 22px;
        }
        .specs {
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .spec-item {
          padding: 8px 10px;
        }
        .spec-val {
          font-size: 13px;
        }
        .purity-badge {
          font-size: 12px;
          padding: 10px 12px;
        }
        .breadcrumb {
          padding: 8px 12px;
          font-size: 11px;
        }
        .nav-btn {
          padding: 6px 10px;
          font-size: 12px;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  idx = 0;
  constructor(
    private route: ActivatedRoute,
    private svc: ProductService,
    public auth: AuthService,
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getOne(id).subscribe((p) => {
      this.product = p;
      this.idx = 0;
    });
  }
  prev() {
    if (this.product)
      this.idx =
        (this.idx - 1 + this.product.images.length) %
        this.product.images.length;
  }
  next() {
    if (this.product) this.idx = (this.idx + 1) % this.product.images.length;
  }
}
