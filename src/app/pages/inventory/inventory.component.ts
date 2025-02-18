import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, RouterModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  categories = ['Wood Care', 'Crafts', 'Furniture'];
  inventory: Product[] = [];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
  ) {
    this.inventory = this.inventoryService.getInventory();
  }

  get groupedProducts(): { [key: string]: Product[] } {
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
}
