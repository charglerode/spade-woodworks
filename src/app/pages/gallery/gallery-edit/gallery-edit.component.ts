import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Gallery } from '../../../models/gallery.model';
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-gallery-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './gallery-edit.component.html',
  styleUrl: './gallery-edit.component.scss',
})
export class GalleryEditComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  galleryForm: FormGroup;
  piece: Gallery | undefined;
  images: any[] = [];
  cover: any[] = [];
  files!: FileList | null;
  timeout: any;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: GalleryService,
  ) {
    this.galleryForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
      ],
      teaser: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      images: this.fb.array([]),
      cover: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getGalleryPieceById(id).subscribe({
        next: (res) => {
          if (res.status == 'success') {
            this.piece = res.data.piece;
            this.galleryForm.patchValue({ name: this.piece?.name });
            this.galleryForm.patchValue({ teaser: this.piece?.teaser });
            this.galleryForm.patchValue({
              description: this.piece?.description,
            });
          }
        },
        error: (err) => {
          //TODO add error message
        },
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
    if (this.galleryForm.valid) {
      Object.keys(this.galleryForm.controls).forEach((formControlName) => {
        formData.append(
          formControlName,
          this.galleryForm.get(formControlName)?.value,
        );
      });
      for (let i = 0; i < this.files?.length!; i++) {
        formData.append('images', this.files![i]);
      }
    }
    if (this.piece) {
      this.service.updateGalleryPiece(this.piece?._id, formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message = 'Gallery piece successfully updated.';
            this.timeout = setTimeout(() => {
              clearTimeout(this.timeout);
              this.router.navigate(['/admin']);
            }, 3000);
          }
        },
        error: (err) => {
          if (err.status === 404) {
            this.error = `No product found with id: ${this.piece?._id}`;
          } else {
            this.error = 'An unknown error occurred. Please try again later.';
          }
        },
      });
    } else {
      this.service.addNewGalleryPiece(formData).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.message = 'New gallery piece successfully added.';
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
