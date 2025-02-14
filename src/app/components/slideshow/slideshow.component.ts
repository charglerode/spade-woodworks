import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'slideshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoAdvance();
  }

  ngOnDestroy(): void {
    this.clearAutoAdvance();
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  selectImage(index: number): void {
    this.currentIndex = index;
    this.restartAutoAdvance();
  }

  startAutoAdvance(): void {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  clearAutoAdvance(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  restartAutoAdvance(): void {
    this.clearAutoAdvance();
    this.startAutoAdvance();
  }
}
