import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decode',
})
export class DecodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }
    let decoded = value.replace(/%20/g, ' ');
    const lines = decoded.split('%0A');
    const paragraphs = lines.map((line) => `<p>${line}</p>`);
    return paragraphs.join('');
  }
}
