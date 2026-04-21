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
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
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
