import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, RouterModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  categories = ['Wood Care', 'Crafts', 'Furniture'];
  inventory: Product[] = [];

  constructor(
    private service: InventoryService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.service.getInventory().subscribe((res) => {
      this.inventory = res.data.products;
    });
  }

  get groupedItems(): { [key: string]: Product[] } {
    const groups: { [key: string]: Product[] } = {
      'Wood Care': [],
      Crafts: [],
      Furniture: [],
    };
    this.inventory.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });
    return groups;
  }

  onNewItem(): void {
    this.router.navigateByUrl('/inventory/new');
  }

  onLogout(): void {
    this.authService.logout();
  }
}
