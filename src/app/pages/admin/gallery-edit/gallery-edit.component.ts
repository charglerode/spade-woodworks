import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Gallery } from '../../../models/gallery.model';
import { GalleryService } from '../../../services/gallery.service';

@Component({
  selector: 'app-gallery-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './gallery-edit.component.html',
  styleUrl: './gallery-edit.component.scss',
})
export class GalleryEditComponent implements OnInit {
  articleForm!: FormGroup;
  piece!: Gallery;
  timeout: any;
  error = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private service: GalleryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      name: ['', Validators.required],
      teaser: ['', Validators.required],
      description: ['', Validators.required],
      images: this.fb.array([]),
    });
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.service.getGalleryPieceById(id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.piece = res.data.piece;
            this.articleForm.patchValue({
              name: this.piece?.name,
              teaser: this.piece?.teaser,
              description: decodeURIComponent(this.piece?.description!),
            });
          }
        },
        error: (err) => {
          // TODO
        },
      });
    }
  }

  get images(): FormArray {
    return this.articleForm.get('images') as FormArray;
  }

  addImage(): void {
    this.images.push(
      this.fb.group({
        image: [null, Validators.required],
        caption: [''],
      }),
    );
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.images.at(index).get('image')?.setValue(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.articleForm.get('name')?.value);
    formData.append('teaser', this.articleForm.get('teaser')?.value);
    formData.append(
      'description',
      encodeURIComponent(this.articleForm.get('description')?.value),
    );

    this.images.controls.forEach((group, index) => {
      const file = group.get('image')?.value;
      const caption = group.get('caption')?.value;
      formData.append(`images[${index}][image]`, file);
      formData.append(`images[${index}][caption]`, caption);
    });

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

  // @ViewChild('fileInput') fileInput!: ElementRef;

  // galleryForm: FormGroup;
  // piece: Gallery | undefined;
  // images: any[] = [];
  // cover: any[] = [];
  // files!: FileList | null;
  // timeout: any;
  // error = '';
  // message = '';

  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private fb: FormBuilder,
  //   private service: GalleryService,
  // ) {
  //   this.galleryForm = this.fb.group({
  //     name: [
  //       '',
  //       [Validators.required, Validators.pattern(/^[A-Za-z\s'-]{2,}$/)],
  //     ],
  //     teaser: ['', [Validators.required, Validators.minLength(10)]],
  //     description: ['', [Validators.required, Validators.minLength(10)]],
  //     images: this.fb.array([]),
  //     cover: this.fb.array([]),
  //   });
  // }

  // ngOnInit(): void {
  //   const id: string | null = this.route.snapshot.paramMap.get('id');
  //   if (id !== null) {
  //     this.service.getGalleryPieceById(id).subscribe({
  //       next: (res) => {
  //         if (res.status == 'success') {
  //           this.piece = res.data.piece;
  //           this.galleryForm.patchValue({ name: this.piece?.name });
  //           this.galleryForm.patchValue({ teaser: this.piece?.teaser });
  //           this.galleryForm.patchValue({
  //             description: this.piece?.description,
  //           });
  //         }
  //       },
  //       error: (err) => {
  //         //TODO add error message
  //       },
  //     });
  //   }
  // }

  // onImageChange(): void {
  //   this.images = [];
  //   this.files = this.fileInput.nativeElement.files;
  //   if (this.files) {
  //     for (let i = 0; i < this.files.length; i++) {
  //       const file = this.files[i];
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.images.push(e.target.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  // onSubmit(): void {
  //   let formData: any = new FormData();
  //   let imgs = [];
  //   if (this.galleryForm.valid) {
  //     Object.keys(this.galleryForm.controls).forEach((formControlName) => {
  //       formData.append(
  //         formControlName,
  //         this.galleryForm.get(formControlName)?.value,
  //       );
  //     });
  //     for (let i = 0; i < this.files?.length!; i++) {
  //       formData.append('images', this.files![i]);
  //     }
  //   }
  //   if (this.piece) {
  //     this.service.updateGalleryPiece(this.piece?._id, formData).subscribe({
  //       next: (res) => {
  //         if (res.status === 'success') {
  //           this.message = 'Gallery piece successfully updated.';
  //           this.timeout = setTimeout(() => {
  //             clearTimeout(this.timeout);
  //             this.router.navigate(['/admin']);
  //           }, 3000);
  //         }
  //       },
  //       error: (err) => {
  //         if (err.status === 404) {
  //           this.error = `No product found with id: ${this.piece?._id}`;
  //         } else {
  //           this.error = 'An unknown error occurred. Please try again later.';
  //         }
  //       },
  //     });
  //   } else {
  //     this.service.addNewGalleryPiece(formData).subscribe({
  //       next: (res) => {
  //         if (res.status === 'success') {
  //           this.message = 'New gallery piece successfully added.';
  //           this.timeout = setTimeout(() => {
  //             clearTimeout(this.timeout);
  //             this.router.navigate(['/admin']);
  //           }, 3000);
  //         }
  //       },
  //       error: (err) => {
  //         this.error = `An unknown error occurred. Please try again later. ${err}`;
  //       },
  //     });
  //   }
  // }
}
