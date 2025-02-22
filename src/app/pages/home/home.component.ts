import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  product: Product | undefined = undefined;

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.service.getFeaturedProduct().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.product = res.data.product;
        }
      },
      error: (res) => {},
    });
  }
}
