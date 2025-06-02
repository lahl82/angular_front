import { Component, Input } from '@angular/core';
import { FormattedPricePipe } from '../../../pipes/formatted-price.pipe';

@Component({
  selector: 'app-price-display',
  imports: [FormattedPricePipe],
  standalone: true,
  templateUrl: './price-display.component.html',
  styleUrls: ['./price-display.component.css']
})
export class PriceDisplayComponent {
  @Input() price: number = 0;
}
