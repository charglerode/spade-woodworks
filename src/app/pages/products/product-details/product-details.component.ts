import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { RouterLink } from '@angular/router';
import { Product, ProductItem } from '../../../models/product.model';
import { SlideshowComponent } from '../../../components/slideshow/slideshow.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, SlideshowComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedOptions: { [key: string]: ProductItem } = {};
  error = '';

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
  ) {}

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getProductById(id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.product = res.data.product;
            this.initDefaults();
          }
        },
        error: (err) => {
          this.error = 'An unknown error occurred. Please try again later.';
        },
      });
    }
  }

  initDefaults(): void {
    this.product?.options.forEach((option) => {
      const defaultItem = option.items.find((item) => item.default);
      if (defaultItem) {
        this.selectedOptions[option.name] = defaultItem;
      }
    });
  }

  onOptionSelected(groupName: string, index: number): void {
    const selectedItem = this.product?.options.find(
      (option) => option.name === groupName,
    )?.items[index];

    if (selectedItem) {
      this.selectedOptions[groupName] = selectedItem;
    }
  }

  isSelected(groupName: string, index: number): boolean {
    const selectedItem = this.product?.options.find(
      (option) => option.name === groupName,
    )?.items[index];
    return selectedItem?.name === this.selectedOptions[groupName]?.name;
  }

  getTotalMultiplier(): number {
    return Object.values(this.selectedOptions).reduce(
      (sum, item) => sum + (item.multiplier > 0 ? item.multiplier : 0),
      0,
    );
  }

  getAdjustedPrice(originalPrice: number, fixed: boolean): number {
    const totalMultiplier = this.getTotalMultiplier();
    return fixed
      ? originalPrice
      : originalPrice + originalPrice * totalMultiplier;
  }

  getTotalPrice(): number {
    return (
      this.product!.price +
      Object.values(this.selectedOptions).reduce(
        (total, item) => total + this.getAdjustedPrice(item.price, item.fixed),
        0,
      )
    );
  }

  onAddToCart(): void {
    console.log(this.selectedOptions);
  }
}
