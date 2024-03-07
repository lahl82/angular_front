import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/iuser.model';
import { StoreContextService } from '../../store/store-context.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionsService } from '../../services/api/sessions.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  message: string = ''
  waiting: boolean = false
  waitingMessage: string = 'Procesando datos. Espere un momento por favor.'

  private form = inject(FormBuilder)
  private _storeContextService = inject(StoreContextService)
  private _apiSessionsService = inject(SessionsService)
  private _route = inject(ActivatedRoute)
  private _router = inject(Router)

  constructor() {
    this.loginForm = this.form.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(value => {
      console.log(value)
    })

    this._route.params.subscribe({
      next: (params: Params) => {
        this.message = params['message']
      }
    })
  }

  ngOnDestroy(): void {
  }

  send() {
    this.waiting = true

    this._apiSessionsService.logIn(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.setSessionUser(data)
          this._router.navigate(['services-list', { message: 'Sesión iniciada' }])
          this.waiting = false
        },
        error: (error: any) => {
          this._router.navigate(['login', { message: 'No se pudo iniciar Sesion' }])
          console.log(error)
          this.waiting = false
        }
      })
  }

  setSessionUser(data: any) {
    let user: IUser = {}

    user.id = data.body.id
    user.name = data.body.name
    user.last_name = data.body.last_name
    user.email = data.body.email
    user.token = data.headers.get("authorization")

    this._storeContextService.setUser(user)
  }

  formInvalid(): boolean {
    return this.loginForm.invalid
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched
  }
}
