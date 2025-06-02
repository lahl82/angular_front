import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedPrice'
})
export class FormattedPricePipe implements PipeTransform {
  transform(value: number | string): { integer: string, decimal: string } {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }

    if (typeof value !== 'number' || isNaN(value)) {
        value = 0;
    }

    const [integerPart, decimalPart] = value.toFixed(2).split('.');

    return {
      integer: integerPart,
      decimal: decimalPart
    };
  }
}
