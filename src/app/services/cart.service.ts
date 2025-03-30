import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

const KEY = 'shopping_cart';
const EXPIRE_KEY = 'shopping_cart_expiration';
const EXPIRE = 7;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor() {}

  private loadCart(): CartItem[] {
    const expiration = localStorage.getItem(EXPIRE_KEY);
    if (expiration && new Date(expiration) < new Date()) {
      this.clearCart();
      return [];
    }
    const cartJson = localStorage.getItem(KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  private saveCart(cart: CartItem[]) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + EXPIRE);
    localStorage.setItem(EXPIRE_KEY, expirationDate.toISOString());
    this.cartSubject.next(cart);
  }

  addItem(item: CartItem) {
    const cart = this.loadCart();
    const index = cart.findIndex(
      (ci) => ci.id === item.id && this.optionsEqual(ci.options, item.options),
    );
    if (index > -1) {
      cart[index].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCart(cart);
  }

  updateItem(id: string, options: string[], quantity: number) {
    const cart = this.loadCart();
    const index = cart.findIndex(
      (ci) => ci.id === id && this.optionsEqual(ci.options, options),
    );
    if (index > -1) {
      cart[index].quantity = quantity;
      this.saveCart(cart);
    }
  }

  removeItem(id: string, options: string[]) {
    let cart = this.loadCart();
    cart = cart.filter(
      (ci) => !(ci.id === id && this.optionsEqual(ci.options, options)),
    );
    this.saveCart(cart);
  }

  clearCart() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(EXPIRE_KEY);
    this.cartSubject.next([]);
  }

  private optionsEqual(options1: string[], options2: string[]): boolean {
    if (options1.length !== options2.length) {
      return false;
    }
    for (let i = 0; i < options1.length; i++) {
      if (options1[i] !== options2[i]) {
        return false;
      }
    }
    return true;
  }
}
