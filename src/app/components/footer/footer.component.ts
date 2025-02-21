import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnDestroy {
  quote: { line: String; attribution: String } = {
    line: 'Give me six hours to chop down a tree and I will spend the first four sharpening the axe.',
    attribution: 'Abraham Lincoln',
  };
  interval: any;

  constructor(private service: QuoteService) {
    this.getQuote();
    this.interval = setInterval(
      () => {
        this.getQuote();
      },
      1000 * 60 * 5,
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  getQuote(): void {
    this.service.getQuote().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.quote = res.data.quote[0];
          console.log(this.quote);
        }
      },
      error: (err) => {
        this.quote = {
          line: 'Give me six hours to chop down a tree and I will spend the first four sharpening the axe.',
          attribution: 'Abraham Lincoln',
        };
      },
    });
  }
}
