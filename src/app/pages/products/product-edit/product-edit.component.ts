import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
})
export class ProductEditComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  productForm: FormGroup;
  product: Product | undefined;
  images: any[] = [];
  files!: FileList | null;
  timeout: any;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: ProductService,
  ) {
    this.productForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
      ],
      price: ['', [Validators.required, Validators.pattern(/^[0-9\s]{1,}$/)]],
      available: false,
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      images: this.fb.array([]),
      featured: false,
    });
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getProductById(id).subscribe((res) => {
        this.product = res.data.product;
        this.productForm.patchValue({ name: this.product?.name });
        this.productForm.patchValue({ price: this.product?.price });
        this.productForm.patchValue({ available: this.product?.available });
        this.productForm.patchValue({ category: this.product?.category });
        this.productForm.patchValue({ description: this.product?.description });
        this.productForm.patchValue({ featured: this.product?.featured });
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
    let formData: any = new FormData();
    let imgs = [];
    if (this.productForm.valid) {
      Object.keys(this.productForm.controls).forEach((formControlName) => {
        formData.append(
          formControlName,
          this.productForm.get(formControlName)?.value,
        );
      });
      for (let i = 0; i < this.files?.length!; i++) {
        formData.append('images', this.files![i]);
      }
    }
    if (this.product) {
      this.service.updateProduct(this.product?._id, formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message = 'Product successfully updated.';
            this.timeout = setTimeout(() => {
              clearTimeout(this.timeout);
              this.router.navigate(['/admin']);
            }, 3000);
          }
        },
        error: (err) => {
          if (err.status === 404) {
            this.error = `No product found with id: ${this.product?._id}`;
          } else {
            this.error = 'An unknown error occurred. Please try again later.';
          }
        },
      });
    } else {
      this.service.addNewProduct(formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message = 'Product successfully added.';
            this.timeout = setTimeout(() => {
              clearTimeout(this.timeout);
              this.router.navigate(['/admin']);
            }, 3000);
          }
        },
        error: (err) => {
          this.error = `An unknown error occurred. Please try again later. ${err}`;
        },
      });
    }
  }
}
