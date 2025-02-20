import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;

  itemForm: FormGroup;
  item: Product | undefined;
  images: any[] = [];
  files!: FileList | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: InventoryService,
  ) {
    this.itemForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
      ],
      price: ['', [Validators.required, Validators.pattern(/^[0-9\s]{1,}$/)]],
      available: false,
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      images: null,
    });
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    // const id = idParam ? +idParam : null;
    if (id !== null) {
      this.service.getItemById(id).subscribe((res) => {
        this.item = res.data.product;
        this.itemForm.patchValue({ name: this.item?.name });
        this.itemForm.patchValue({ price: this.item?.price });
        this.itemForm.patchValue({ available: this.item?.available });
        this.itemForm.patchValue({ category: this.item?.category });
        this.itemForm.patchValue({ description: this.item?.description });
      });
    }
  }

  onImageChange(): void {
    this.images = [];
    this.files = this.fileInput.nativeElement.files;
    if (this.files) {
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.itemForm.patchValue({ images: this.files });
    }
  }
}
