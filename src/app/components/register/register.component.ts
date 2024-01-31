import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DocumentComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup
  activeUser: any = {
    name: 'Pedro',
    secondName: 'perez',
    document: '14.984.454'
  }
  documentTypes: string[] = ['Cedula', 'Pasaporte']
  documentNameTypeSelected?: string
  showDocument: boolean = false

  private form = inject(FormBuilder)

  constructor() {
    this.registerForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      secondName: [''],
      documentType: [''],
      email: ['', [Validators.email, Validators.required]]
    })
  }

  ngOnInit(): void {
    if (this.activeUser.secondName.length < 3) {
      this.registerForm.get('secondName')?.setValidators([Validators.required, Validators.minLength(3)])
      // this.registerForm.get('secondName')?.clearValidators()
      // this.registerForm.get('secondName')?.updateValueAndValidity()
    } else {
      this.registerForm.get('secondName')?.disable()
    }

    this.registerForm.patchValue(this.activeUser)

    this.registerForm.get('name')?.disable()
    this.registerForm.get('document')?.disable()

    this.registerForm.valueChanges.subscribe(value => {
      console.log(value)
    })

    this.registerForm.get('documentType')?.valueChanges.subscribe(value => {
      this.showDocument = value != ''
      this.documentNameTypeSelected = this.documentTypes[value]
    })
  }

  ngOnDestroy(): void {
    console.log('componente destruido')
  }

  send() {
    console.log(this.registerForm)
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched
  }
}
