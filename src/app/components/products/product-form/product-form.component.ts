import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Product,
  ProductImage,
  GOLD_CATEGORIES,
} from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/products" class="logo"
          ><span>♛</span><span class="logo-text"> GoldMart</span></a
        >
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </div>
    </nav>

    <div class="form-page">
      <div class="form-card">
        <div class="form-header">
          <h2>{{ isEdit ? '✏️ Edit Product' : '+ List New Product' }}</h2>
          <a routerLink="/products" class="cancel-link">Cancel</a>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="section-title">Product Details</div>
          <div class="row-2">
            <div class="field">
              <label>Product Name *</label>
              <input
                formControlName="name"
                placeholder="e.g. Classic Solitaire Ring"
              />
            </div>
            <div class="field">
              <label>Product Type *</label>
              <input
                formControlName="productType"
                placeholder="e.g. Solitaire Ring"
              />
            </div>
          </div>
          <div class="row-3">
            <div class="field">
              <label>Category *</label>
              <select formControlName="category">
                <option value="">Select category</option>
                <option *ngFor="let c of categories" [value]="c">
                  {{ c }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>Karat *</label>
              <select formControlName="karat">
                <option value="">Select karat</option>
                <option *ngFor="let k of karats" [value]="k">{{ k }}K</option>
              </select>
            </div>
            <div class="field">
              <label>Hallmark *</label>
              <input formControlName="hallmark" placeholder="e.g. BIS 916" />
            </div>
          </div>
          <div class="row-3">
            <div class="field">
              <label>Price (₹) *</label>
              <input formControlName="price" type="number" min="0" />
            </div>
            <div class="field">
              <label>Weight (grams) *</label>
              <input
                formControlName="weight"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div class="field">
              <label>Stock *</label>
              <input formControlName="stock" type="number" min="0" />
            </div>
          </div>

          <div class="section-title">Product Images</div>
          <div
            class="drop-zone"
            (dragover)="$event.preventDefault()"
            (drop)="onDropImages($event)"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              (change)="onImages($event)"
              #imgInput
              hidden
            />
            <div class="drop-content">
              <div class="upload-icon">🖼️</div>
              <p>
                Drag & drop images or
                <button type="button" (click)="imgInput.click()">browse</button>
              </p>
              <p class="hint">JPG, PNG, WEBP · Max 10 · First = thumbnail</p>
            </div>
          </div>
          <div class="preview-grid" *ngIf="imagePreviews.length">
            <div
              class="prev-item"
              *ngFor="let p of imagePreviews; let i = index"
            >
              <img [src]="p.url" [alt]="p.name" />
              <button type="button" class="del-btn" (click)="removeImage(i)">
                ✕
              </button>
              <span class="thumb-label" *ngIf="i === 0">Thumbnail</span>
            </div>
          </div>
          <div *ngIf="isEdit && product?.images?.length">
            <p class="existing-label">Existing images</p>
            <div class="preview-grid">
              <div class="prev-item" *ngFor="let img of product!.images">
                <img [src]="img.url" />
                <button
                  type="button"
                  class="del-btn"
                  (click)="deleteExistingImage(img)"
                >
                  ✕
                </button>
                <span class="thumb-label" *ngIf="img.isThumbnail"
                  >Thumbnail</span
                >
              </div>
            </div>
          </div>

          <div class="section-title">
            Product Video <span class="optional">(optional)</span>
          </div>
          <div
            class="drop-zone"
            (dragover)="$event.preventDefault()"
            (drop)="onDropVideo($event)"
          >
            <input
              type="file"
              accept="video/*"
              (change)="onVideo($event)"
              #vidInput
              hidden
            />
            <div class="drop-content">
              <div class="upload-icon">🎬</div>
              <ng-container *ngIf="videoFile; else noVid">
                <p class="vid-name">{{ videoFile.name }}</p>
                <button
                  type="button"
                  class="remove-vid"
                  (click)="videoFile = null"
                >
                  Remove
                </button>
              </ng-container>
              <ng-template #noVid>
                <p>
                  Drag & drop a video or
                  <button type="button" (click)="vidInput.click()">
                    browse
                  </button>
                </p>
                <p class="hint">MP4, WEBM, MOV · Max 200MB</p>
              </ng-template>
            </div>
          </div>
          <div
            *ngIf="isEdit && product?.video && !videoFile"
            class="existing-video"
          >
            <p class="existing-label">Existing video</p>
            <video
              [src]="product!.video!.url"
              controls
              class="existing-vid-player"
            ></video>
          </div>

          <div class="form-actions">
            <a routerLink="/products" class="cancel-btn">Cancel</a>
            <button
              type="submit"
              class="submit-btn"
              [disabled]="form.invalid || saving"
            >
              {{
                saving
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Product'
                    : 'List Product'
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
      .logout-btn {
        background: transparent;
        color: #daa520;
        border: 1px solid #daa520;
        padding: 7px 14px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      }
      .form-page {
        background: #f9f3e8;
        min-height: calc(100vh - 60px);
        padding: 24px;
      }
      .form-card {
        max-width: 900px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(184, 134, 11, 0.1);
      }
      .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f0e6c8;
      }
      .form-header h2 {
        font-size: 20px;
        font-weight: 600;
        color: #1a1008;
      }
      .cancel-link {
        font-size: 13px;
        color: #878787;
        text-decoration: none;
      }
      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: #b8860b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 20px 0 14px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0e6c8;
      }
      .optional {
        font-size: 12px;
        color: #878787;
        text-transform: none;
        font-weight: 400;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
      }
      label {
        font-size: 13px;
        font-weight: 500;
        color: #1a1008;
      }
      input,
      select {
        border: 1px solid #d0c090;
        border-radius: 4px;
        padding: 10px 12px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        background: #fff;
        width: 100%;
      }
      input:focus,
      select:focus {
        border-color: #b8860b;
      }
      .row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .row-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
      }
      .drop-zone {
        border: 2px dashed #d0c090;
        border-radius: 6px;
        padding: 24px;
        text-align: center;
        background: #fdf6e3;
        transition: border-color 0.2s;
      }
      .drop-zone:hover {
        border-color: #b8860b;
      }
      .drop-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .upload-icon {
        font-size: 32px;
      }
      .drop-content p {
        font-size: 14px;
        color: #1a1008;
      }
      .drop-content button {
        background: none;
        border: none;
        color: #b8860b;
        cursor: pointer;
        text-decoration: underline;
        font-size: 14px;
      }
      .hint {
        font-size: 12px;
        color: #878787 !important;
      }
      .vid-name {
        font-size: 14px;
        color: #1a1008;
        font-weight: 500;
      }
      .remove-vid {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffc107;
        border-radius: 4px;
        padding: 4px 12px;
        cursor: pointer;
        font-size: 12px;
      }
      .preview-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 12px;
      }
      .prev-item {
        position: relative;
        width: 100px;
        height: 100px;
        border: 1px solid #f0e6c8;
        border-radius: 6px;
        overflow: hidden;
        background: #fdf6e3;
      }
      .prev-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .del-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0, 0, 0, 0.55);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thumb-label {
        position: absolute;
        bottom: 4px;
        left: 4px;
        background: #b8860b;
        color: #fff;
        font-size: 9px;
        padding: 2px 5px;
        border-radius: 3px;
      }
      .existing-label {
        font-size: 12px;
        color: #878787;
        margin: 12px 0 8px;
      }
      .existing-video {
        margin-top: 12px;
      }
      .existing-vid-player {
        width: 100%;
        max-height: 220px;
        border-radius: 6px;
        background: #000;
        display: block;
      }
      .form-actions {
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid #f0e6c8;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cancel-btn {
        padding: 12px 24px;
        border: 1px solid #d0c090;
        border-radius: 4px;
        color: #1a1008;
        text-decoration: none;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
      .submit-btn {
        background: #b8860b;
        color: #fff;
        border: none;
        padding: 13px 40px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }
      .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* ════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ════════════════════════════════════ */

      /* md: 768–1023px */
      @media (max-width: 1023px) {
        .form-card {
          padding: 24px;
        }
      }

      /* sm: 480–767px */
      @media (max-width: 767px) {
        .navbar {
          padding: 0 16px;
        }
        .logo-text {
          display: none;
        }
        .form-page {
          padding: 12px;
        }
        .form-card {
          padding: 20px 16px;
          border-radius: 6px;
        }
        .form-header h2 {
          font-size: 17px;
        }
        .row-2 {
          grid-template-columns: 1fr;
        }
        .row-3 {
          grid-template-columns: 1fr 1fr;
        }
        .drop-zone {
          padding: 16px;
        }
        .form-actions {
          justify-content: stretch;
        }
        .cancel-btn,
        .submit-btn {
          flex: 1;
          text-align: center;
          justify-content: center;
        }
      }

      /* xs: < 480px */
      @media (max-width: 479px) {
        .row-3 {
          grid-template-columns: 1fr;
        }
        .form-card {
          padding: 16px 12px;
        }
        .prev-item {
          width: 80px;
          height: 80px;
        }
        .drop-zone {
          padding: 14px 10px;
        }
        .upload-icon {
          font-size: 24px;
        }
        .drop-content p {
          font-size: 13px;
        }
        .submit-btn {
          padding: 12px 20px;
          font-size: 14px;
        }
      }
    `,
  ],
})
export class ProductFormComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    productType: ['', Validators.required],
    category: ['', Validators.required],
    karat: ['', Validators.required],
    hallmark: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    weight: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, Validators.min(0)],
  });

  categories = GOLD_CATEGORIES;
  karats = [14, 18, 22, 24];
  isEdit = false;
  product: Product | null = null;
  imageFiles: File[] = [];
  imagePreviews: { url: string; name: string }[] = [];
  videoFile: File | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getOne(id).subscribe((p) => {
        this.product = p;
        this.form.patchValue({
          ...p,
          karat: String(p.karat),
        });
      });
    }
  }

  onImages(e: Event) {
    this.addImages(Array.from((e.target as HTMLInputElement).files ?? []));
  }
  onDropImages(e: DragEvent) {
    e.preventDefault();
    this.addImages(Array.from(e.dataTransfer?.files ?? []));
  }
  addImages(files: File[]) {
    files.forEach((f) => {
      this.imageFiles.push(f);
      this.imagePreviews.push({ url: URL.createObjectURL(f), name: f.name });
    });
  }
  removeImage(i: number) {
    this.imageFiles.splice(i, 1);
    this.imagePreviews.splice(i, 1);
  }
  onVideo(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.videoFile = f;
  }
  onDropVideo(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f?.type.startsWith('video/')) this.videoFile = f;
  }
  deleteExistingImage(img: ProductImage) {
    if (!this.product) return;
    this.svc
      .deleteImage(this.product._id, img._id)
      .subscribe((p) => (this.product = p));
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) =>
      fd.append(k, String(v ?? '')),
    );
    this.imageFiles.forEach((f) => fd.append('images', f));
    if (this.videoFile) fd.append('video', this.videoFile);

    const req = this.isEdit
      ? this.svc.update(this.product!._id, this.form.value)
      : this.svc.create(fd);
    req.subscribe({
      next: (p) => {
        if (this.isEdit && (this.imageFiles.length || this.videoFile)) {
          const mf = new FormData();
          this.imageFiles.forEach((f) => mf.append('images', f));
          if (this.videoFile) mf.append('video', this.videoFile);
          this.svc
            .addImages(p._id, mf)
            .subscribe(() => this.router.navigate(['/products', p._id]));
        } else {
          this.router.navigate(['/products', p._id]);
        }
      },
      error: () => {
        this.saving = false;
      },
    });
  }
}
