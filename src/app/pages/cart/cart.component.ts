import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, CartItem } from '../../models/cart.model';
import { Subscription, switchMap } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly api = '/api/v1/checkout/';
  cart: Cart = {
    items: [],
  };
  cartSubscription!: Subscription;

  constructor(
    private service: CartService,
    private stripe: StripeService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.service.cart$.subscribe((items) => {
      this.cart.items = items;
    });
  }

  get subtotal(): number {
    let amount: number = 0;
    this.cart.items.forEach((item) => {
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

  onCheckout(): void {
    this.http
      .post(`http://127.0.0.1:8000${this.api}create-session/`, this.cart)
      .pipe(
        switchMap((session: any) => {
          return this.stripe.redirectToCheckout({ sessionId: session.id });
        }),
      )
      .subscribe((result) => {
        if (result.error) {
          alert(result.error.message);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
