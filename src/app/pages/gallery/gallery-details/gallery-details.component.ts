import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Gallery } from '../../../models/gallery.model';
import { GalleryService } from '../../../services/gallery.service';
import { ActivatedRoute } from '@angular/router';
import { DecodePipe } from '../../../pipes/decode.pipe';

@Component({
  selector: 'app-gallery-details',
  imports: [DecodePipe],
  templateUrl: './gallery-details.component.html',
  styleUrl: './gallery-details.component.scss',
})
export class GalleryDetailsComponent implements OnInit, AfterViewInit {
  piece!: Gallery;

  constructor(
    private service: GalleryService,
    private route: ActivatedRoute,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.service.getGalleryPieceById(id!).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.piece = res.data.piece;
        }
      },
      error: (err) => {
        // TODO
      },
    });
  }

  ngAfterViewInit(): void {
    let p = this.el.nativeElement.querySelectorAll('p');
    p.forEach((paragraph: any, index: number) => {
      if (index < this.piece.images.length) {
        let div = document.createElement('div');
        div.classList.add('preview');
        const img = document.createElement('img');
        img.width = 640;
        img.src = `img/uploads/${this.piece.images[index].image}`;
        let caption = document.createElement('caption');
        caption.innerHTML = this.piece.images[index].caption;
        div.appendChild(img);
        div.appendChild(caption);
        paragraph.parentNode?.insertBefore(div, paragraph.nextSibling);
      }
    });
  }
}
