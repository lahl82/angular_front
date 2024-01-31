import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'document-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent  implements OnChanges {

  documentTypes: string[] = ['Cedula', 'Pasaporte']

  @Input() documentNameTypeSelected?: string = 'something'
  documentForm: FormGroup

  private form = inject(FormBuilder)

  constructor() {
    this.documentForm = this.form.group({
      dni: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes?.['documentNameTypeSelected'].currentValue)
  }

  hasErrors(controlName: string, errorType: string) {
    return this.documentForm.get(controlName)?.hasError(errorType) && this.documentForm.get(controlName)?.touched
  }
}
