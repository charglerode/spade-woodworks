import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Gallery } from '../../models/gallery.model';
import { GalleryService } from '../../services/gallery.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  gallery: Gallery[] = [];

  constructor(private service: GalleryService) {}

  ngOnInit(): void {
    this.service.getGallery().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.gallery = res.data.gallery;
        }
      },
      error: (err) => {
        //TODO show error text
      },
    });
  }
}
