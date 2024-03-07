import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/iuser.model';
import { Router } from '@angular/router';
import { SessionsService } from '../../services/api/sessions.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DocumentComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup
  activeUser: IUser = {}
  documentTypes: string[] = ['Cédula', 'Pasaporte']
  documentNameTypeSelected?: string
  showDocument: boolean = false
  message: string = ''
  waiting: boolean = false
  waitingMessage: string = 'Salvando datos. Espere un momento'
  dni: string = ''

  private form = inject(FormBuilder)
  private _apiSessionsService = inject(SessionsService)
  private _router = inject(Router)

  constructor() {
    this.registerForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      documentType: [''],
      email: ['', [Validators.email, Validators.required]]
    })
  }

  ngOnInit(): void {
    // this.activeUser = this._storeContextService.getUser()

    // if (this.activeUser.secondName != null && String(this.activeUser.secondName).length < 3) {
    //   this.registerForm.get('secondName')?.setValidators([Validators.required, Validators.minLength(3)])
    //   this.registerForm.get('secondName')?.clearValidators()
    //   this.registerForm.get('secondName')?.updateValueAndValidity()
    // } else {
    //   this.registerForm.get('secondName')?.disable()
    // }

    // this.registerForm.patchValue(this.activeUser)

    // this.registerForm.get('name')?.disable()
    // this.registerForm.get('document')?.disable()

    this.registerForm.valueChanges.subscribe(value => {
      console.log(value)
    })

    this.registerForm.get('documentType')?.valueChanges.subscribe(value => {
      this.showDocument = value != ''
      this.documentNameTypeSelected = this.documentTypes[value]
    })
  }

  ngOnDestroy(): void {
  }

  send() {
    this.waiting = true

    const userData = this.prepareDataToPost()

    this._apiSessionsService.signUp(userData)
      .subscribe({
        next: (data: IUser) => {
          this._router.navigate(['login', { message: 'Usuario creado exitosamente' }])
          this.waiting = false
        },
        error: (error: any) => {
          this._router.navigate(['register', { message: 'No se pudo crear el Usuario' }])
          console.log(error)
          this.waiting = false
        }
      })
  }

  prepareDataToPost(): IUser {
    let userData: IUser = {}

    userData['name'] = this.registerForm.value['name']
    userData['last_name'] = this.registerForm.value['lastName']
    userData['address'] = 'aqui mismito' // this.registerForm.value['address']
    userData['phone'] = '123456789123' // this.registerForm.value['phone']
    userData['password'] = 'Repostero2021%' // this.registerForm.value['phone']
    userData['document_type'] = this.documentNameTypeSelected
    userData['dni'] = this.dni
    userData['email'] = this.registerForm.value['email']

    return userData
  }

  formInvalid(): boolean {
    return this.registerForm.invalid
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched
  }

  dniListener($event: any) {
    this.dni = $event
  }
}
