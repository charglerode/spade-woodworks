import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('menu') menu: ElementRef | undefined;
  @ViewChild('icon') icon: ElementRef | undefined;

  itemsInCart: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.cartService.cart$.subscribe((items) => {
      this.itemsInCart = items.length;
    });
  }

  toggleMenu(): void {
    if (this.menu?.nativeElement.classList.contains('active')) {
      this.menu?.nativeElement.classList.remove('active');
      this.icon!.nativeElement.innerHTML = '<i class="fa-solid fa-bars"></i>';
    } else {
      this.menu?.nativeElement.classList.add('active');
      this.icon!.nativeElement.innerHTML = '<i class="fa-solid fa-times"></i>';
    }
  }

  menuSelected(page: string): void {
    this.toggleMenu();
    this.router.navigate([page]);
  }
}
