import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Gallery } from '../../models/gallery.model';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  selected = 'products';
  categories = ['Wood Care', 'Crafts', 'Furniture'];
  products: Product[] = [];
  gallery: Gallery[] = [];

  constructor(
    private productService: ProductService,
    private galleryService: GalleryService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.products = res.data.products;
        }
      },
      error: (err) => {
        //TODO show error text
      },
    });

    this.galleryService.getGallery().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.gallery = res.data.gallery;
        }
      },
      error: (err) => {
        //TODO show error text
      },
    });
  }

  get groupedItems(): { [key: string]: Product[] } {
    const groups: { [key: string]: Product[] } = {
      'Wood Care': [],
      Crafts: [],
      Furniture: [],
    };
    this.products.forEach((product) => {
      if (groups[product.category]) {
        groups[product.category].push(product);
      }
    });
    return groups;
  }

  onNewProduct(): void {
    this.router.navigateByUrl('/admin/products/new');
  }

  onNewGalleryPiece(): void {
    this.router.navigateByUrl('admin/gallery/new');
  }

  onLogout(): void {
    this.authService.logout();
  }
}
