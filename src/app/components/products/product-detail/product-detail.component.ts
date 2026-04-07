import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Media } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `./product-detail.component.html`,
  styleUrls: [`./product-detail.component.scss`],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  images: Media[] = [];
  video: Media | null = null;
  activeIdx = 0;

  constructor(
    private route: ActivatedRoute,
    private svc: ProductService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getOne(id).subscribe((p) => {
      this.product = p;
      this.images = p.media.filter((m) => m.resourceType === 'image');
      this.video = p.media.find((m) => m.resourceType === 'video') ?? null;
      this.activeIdx = 0;
    });
  }

  goToSlide(i: number) {
    this.activeIdx = i;
  }
  prevSlide() {
    this.activeIdx =
      (this.activeIdx - 1 + this.images.length) % this.images.length;
  }
  nextSlide() {
    this.activeIdx = (this.activeIdx + 1) % this.images.length;
  }
}
