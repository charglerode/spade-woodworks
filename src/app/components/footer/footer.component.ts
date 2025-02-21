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
    this.quote = this.service.getQuote();
    this.interval = setInterval(
      () => {
        this.quote = this.service.getQuote();
      },
      1000 * 60 * 5,
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
