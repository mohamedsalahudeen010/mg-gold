import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Media } from '../../../core/models/product.model';

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
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0],
    category: [''],
  });

  categories = ['Mobiles', 'Laptops', 'TVs', 'Cameras', 'Audio', 'Fashion'];
  isEdit = false;
  product: Product | null = null;
  files: File[] = [];
  previews: { url: string; type: 'image' | 'video'; name: string }[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.svc.getOne(id).subscribe((p) => {
        this.product = p;
        this.form.patchValue(p);
      });
    }
  }

  onFiles(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files) this.addFiles(Array.from(e.dataTransfer.files));
  }

  addFiles(newFiles: File[]) {
    newFiles.forEach((f) => {
      this.files.push(f);
      const isVideo = f.type.startsWith('video/');
      this.previews.push({
        url: isVideo ? '' : URL.createObjectURL(f),
        type: isVideo ? 'video' : 'image',
        name: f.name,
      });
    });
  }

  removePreview(i: number) {
    this.files.splice(i, 1);
    this.previews.splice(i, 1);
  }

  deleteExisting(m: Media) {
    if (!this.product) return;
    this.svc
      .deleteMedia(this.product._id, m._id)
      .subscribe((p) => (this.product = p));
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) =>
      fd.append(k, String(v ?? '')),
    );
    this.files.forEach((f) => fd.append('media', f));

    const req = this.isEdit
      ? this.svc.update(this.product!._id, this.form.value as any)
      : this.svc.create(fd);

    req.subscribe({
      next: (p) => {
        if (this.isEdit && this.files.length) {
          this.svc
            .addMedia(p._id, fd)
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
