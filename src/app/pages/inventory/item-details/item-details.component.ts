import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '../../../models/product.model';
import { InventoryService } from '../../../services/inventory.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-item-details',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent {
  itemForm: FormGroup;
  item: Product | undefined;
  images: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
  ) {
    this.itemForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
      ],
      price: ['', [Validators.required, Validators.pattern(/^[0-9\s]{1,}$/)]],
      available: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      images: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    if (id !== null) {
      this.item = this.inventoryService.getItemById(id);
    }
  }

  addImages(event: any): void {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      files.forEach((file: any) => {
        this.images.push(file.name);
      });
    }
  }

  /**
   * Basic sanitization that removes any HTML or script tags.
   * In production, consider using a robust library (e.g. DOMPurify) or server-side sanitization.
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/<.*?>/g, '');
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const rawData = this.itemForm.value;
      const sanitizedData = {
        name: this.sanitizeInput(rawData.name),
        category: this.sanitizeInput(rawData.category),
        description: this.sanitizeInput(rawData.description),
      };
      console.log('Sanitized contact form submission', sanitizedData);
      this.router.navigate(['/inventory']);
    }
  }
}
