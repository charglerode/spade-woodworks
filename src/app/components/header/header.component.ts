import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  itemsInCart: number = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe((items) => {
      this.itemsInCart = items.length;
    });
  }
}
