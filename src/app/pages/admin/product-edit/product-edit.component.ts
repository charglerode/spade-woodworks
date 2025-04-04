import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Product, ProductItem } from '../../../models/product.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DecodePipe } from '../../../pipes/decode.pipe';

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

  get shipping(): FormArray {
    return this.productForm.get('shipping') as FormArray;
  }

  get options(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: ProductService,
    private decode: DecodePipe,
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
      shipping: this.fb.array([]),
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getProductById(id).subscribe((res) => {
        this.product = res.data.product;
        this.productForm.patchValue({
          name: this.product?.name,
          price: this.product?.price,
          available: this.product?.available,
          category: this.product?.category,
          description: decodeURIComponent(this.product?.description!),
          featured: this.product?.featured,
        });
        this.setShippingRates(this.product?.shipping || []);
        this.setProductOptions(this.product?.options || []);
      });
    }
  }

  addShippingRate(): void {
    this.shipping.push(
      this.fb.group({
        display: [''],
        minimum: [0],
        maximum: [0],
        cost: [0],
      }),
    );
  }

  removeShippingRate(index: number): void {
    this.shipping.removeAt(index);
  }

  addGroup(): void {
    this.options.push(
      this.fb.group({
        name: ['', Validators.required],
        items: this.fb.array([]), // Items under this group
      }),
    );
  }

  removeGroup(index: number): void {
    this.options.removeAt(index);
  }

  getItems(groupIndex: number): FormArray {
    return (this.options.at(groupIndex) as FormGroup).get('items') as FormArray;
  }

  addItem(groupIndex: number): void {
    this.getItems(groupIndex).push(
      this.fb.group({
        name: ['', Validators.required],
        price: [0, Validators.required],
        fixed: [true],
        multiplier: [0],
        default: [false],
      }),
    );
  }

  removeItem(groupIndex: number, itemIndex: number): void {
    this.getItems(groupIndex).removeAt(itemIndex);
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
    if (this.productForm.valid) {
      const formData = this.convertFormToFormData(this.productForm);
      if (this.product) {
        this.service.updateProduct(this.product._id, formData).subscribe({
          next: (res) => {
            this.message = 'Product successfully updated.';
          },
          error: this.handleError.bind(this),
        });
      } else {
        this.service.addNewProduct(formData).subscribe({
          next: (res) => {
            this.message = 'Product successfully added.';
          },
          error: this.handleError.bind(this),
        });
      }
    }
  }

  private setShippingRates(rates: any[]): void {
    rates.forEach((rate) => {
      this.shipping.push(
        this.fb.group({
          display: [rate.display],
          minimum: [rate.minimum],
          maximum: [rate.maximum],
          cost: [rate.cost],
        }),
      );
    });
  }

  private setProductOptions(options: any[]): void {
    options.forEach((group) => {
      const groupForm = this.fb.group({
        name: [group.name, Validators.required],
        items: this.fb.array([]),
      });

      group.items.forEach((item: ProductItem) => {
        (groupForm.get('items') as FormArray).push(
          this.fb.group({
            name: [item.name, Validators.required],
            price: [item.price, Validators.required],
            fixed: [item.fixed],
            multiplier: [item.multiplier],
            default: [item.default],
          }),
        );
      });

      this.options.push(groupForm);
    });
  }

  private convertFormToFormData(form: FormGroup): FormData {
    const formData = new FormData();

    formData.append('name', form.get('name')?.value);
    formData.append('price', form.get('price')?.value);
    formData.append('available', form.get('available')?.value);
    formData.append('category', form.get('category')?.value);
    formData.append(
      'description',
      encodeURIComponent(form.get('description')?.value),
    );
    formData.append('featured', form.get('featured')?.value);
    if (this.files) {
      for (let i = 0; i < this.files.length; i++) {
        formData.append('images', this.files[i]);
      }
    }
    this.shipping.controls.forEach((control: any, index: number) => {
      console.log(control.value);
      formData.append(`shipping[${index}][display]`, control.value.display);
      formData.append(`shipping[${index}][minimum]`, control.value.minimum);
      formData.append(`shipping[${index}][maximum]`, control.value.maximum);
      formData.append(`shipping[${index}][cost]`, control.value.cost);
    });

    this.options.controls.forEach((groupControl, groupIndex) => {
      const group = groupControl.value;
      formData.append(`options[${groupIndex}][name]`, group.name);

      group.items.forEach((item: any, itemIndex: number) => {
        formData.append(
          `options[${groupIndex}][items][${itemIndex}][name]`,
          item.name,
        );
        formData.append(
          `options[${groupIndex}][items][${itemIndex}][price]`,
          item.price,
        );
        formData.append(
          `options[${groupIndex}][items][${itemIndex}][fixed]`,
          item.fixed,
        );
        formData.append(
          `options[${groupIndex}][items][${itemIndex}][multiplier]`,
          item.multiplier,
        );
        formData.append(
          `options[${groupIndex}][items][${itemIndex}][default]`,
          item.default,
        );
      });
    });

    return formData;
  }

  private handleError(err: HttpErrorResponse): void {
    this.error = `An error occurred: ${err.message}`;
  }
}
