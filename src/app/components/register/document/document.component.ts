import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'document-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent  implements OnInit, OnChanges {

  documentTypes: string[] = ['Cédula', 'Pasaporte']

  @Input() documentNameTypeSelected?: string = 'DNI'
  @Output() dni = new EventEmitter<any>()

  documentForm: FormGroup

  private form = inject(FormBuilder)

  constructor() {
    this.documentForm = this.form.group({
      dni: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {
    this.documentForm.valueChanges.subscribe(value => {
      this.dni.emit(value?.['dni'])
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges')
  }

  hasErrors(controlName: string, errorType: string) {
    return this.documentForm.get(controlName)?.hasError(errorType) && this.documentForm.get(controlName)?.touched
  }
}
