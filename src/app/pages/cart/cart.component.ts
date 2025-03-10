import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSubscription!: Subscription;

  constructor(private service: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.service.cart$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  get subtotal(): number {
    let amount: number = 0;
    this.cartItems.forEach((item) => {
      amount += item.price * item.quantity;
    });
    return amount;
  }

  get tax(): number {
    return 0;
  }

  get shipping(): number {
    return 0;
  }

  updateQuantity(item: CartItem, event: any) {
    const quantity = parseInt(event.target.value, 10);
    if (quantity > 0) {
      this.service.updateItem(item.id, item.options, quantity);
    } else {
      this.service.removeItem(item.id, item.options);
    }
  }

  removeItem(item: CartItem) {
    this.service.removeItem(item.id, item.options);
  }

  checkout() {
    alert('Proceeding to checkout...');
    // Future implementation: integrate with checkout flow
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
