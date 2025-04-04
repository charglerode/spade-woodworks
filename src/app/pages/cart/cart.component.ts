import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, CartItem } from '../../models/cart.model';
import { Subscription, switchMap } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StripeService } from 'ngx-stripe';
import { ShippingRate } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly api = '/api/v1/checkout/';
  cart: Cart = {
    shipping: {
      display: '',
      minimum: 0,
      maximum: 0,
      cost: 0,
    },
    items: [],
  };
  cartSubscription!: Subscription;
  sessionId = '';
  shippingRates: { display: string; cost: number }[] = [];
  selectedShipping = 0;
  shipping = 0;
  // tax = 0;

  get subtotal(): number {
    let amount: number = 0;
    this.cart.items.forEach((item) => {
      amount += item.price * item.quantity;
    });
    return amount;
  }

  constructor(
    private service: CartService,
    private stripe: StripeService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.service.cart$.subscribe((items) => {
      this.cart.items = items;
    });
    this.setShippingRates();
    this.setShipping(0);
  }

  onShippingChange(event: any): void {
    this.setShipping(event.target.value);
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
    this.cart.shipping.cost *= 100;
    this.http
      .post(`http://127.0.0.1:8000${this.api}create-session/`, this.cart)
      .pipe(
        switchMap((res: any) => {
          return this.stripe.redirectToCheckout({ sessionId: res.session.id });
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

  private setShippingRates(): void {
    this.cart.items[0]?.shipping?.forEach((rate) => {
      this.shippingRates.push({
        display: rate.display,
        cost: 0,
      });
    });
    this.shippingRates.forEach((rate, index) => {
      this.cart.items.forEach((item) => {
        rate.cost += item.shipping[index].cost;
      });
    });
  }

  private setShipping(index: number): void {
    this.shipping = this.cart.items.reduce(
      (acc, item: CartItem) => acc + item.shipping[index].cost,
      0,
    );
    this.cart.shipping = {
      display: this.cart.items[0].shipping[index].display,
      minimum: this.cart.items[0].shipping[index].minimum,
      maximum: this.cart.items[0].shipping[index].maximum,
      cost: this.shipping,
    };
  }
}
