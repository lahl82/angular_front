import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() perPage = 10;
  @Input() perPageOptions: number[] = [5, 10, 20, 50];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageWindowSize = 5;

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  get pagesRange(): number[] {
    let arraySize = this.pageWindowSize;
    let firstValue = this.currentPage + 1 - ((this.currentPage % this.pageWindowSize) ? this.currentPage % this.pageWindowSize : this.pageWindowSize);

    if (this.totalPages < this.pageWindowSize) {
      arraySize = this.totalPages;
    }

    if ((firstValue + arraySize) > this.totalPages) {
      arraySize = this.totalPages - firstValue + 1;
    }

    return new Array(arraySize).fill(firstValue).map((n, i) => n + i);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
