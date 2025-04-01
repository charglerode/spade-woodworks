import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  customer!: any;
  items!: any;

  constructor(
    private cart: CartService,
    private service: CheckoutService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cart.clearCart();
    const id: string | null = this.route.snapshot.paramMap.get('id') as string;
    this.service.getSession(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.customer = res.data.customer;
          this.items = res.data.items;
          console.log(this.items[0].price.product.images[0]);
        }
      },
      error: (err) => {},
    });
  }
}
