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
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
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
