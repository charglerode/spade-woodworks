import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  categories = ['Wood Care', 'Crafts', 'Furniture'];
  selectedSort: string = 'priceAsc';
  products: Product[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  onSortChange(event: Event): void {
    const sortValue = (event.target as HTMLSelectElement).value;
    this.selectedSort = sortValue;
  }

  productSelected(id: string): void {
    alert(`Product ${id} selected`);
  }

  get sortedProducts(): Product[] {
    let filtered = [...this.products];
    if (this.selectedSort === 'availability') {
      filtered = filtered.filter((product) => product.available);
    }
    if (this.selectedSort === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    return filtered;
  }

  get groupedProducts(): { [key: string]: Product[] } {
    const groups: { [key: string]: Product[] } = {
      'Wood Care': [],
      Crafts: [],
      Furniture: [],
    };
    this.sortedProducts.forEach((product) => {
      if (groups[product.category]) {
        groups[product.category].push(product);
      }
    });
    return groups;
  }
}
