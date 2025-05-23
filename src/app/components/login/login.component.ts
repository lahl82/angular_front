import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/iuser.model';
import { StoreContextService } from '../../store/store-context.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionsService } from '../../services/api/sessions.service';
import { HttpHeaders } from '@angular/common/http';
import { formatApiError } from '../../utils/error-handler';

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
  errorMessage: string = ''
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
        next: (response: any) => {
          const userData = response.body?.data.user;
          const headers = response.headers;

          this.setSessionUser(userData, headers)
          this._router.navigate(['services-list', { message: 'Sesión iniciada' }])
          this.waiting = false
        },
        error: (err: any) => {
          this.waiting = false;
          this.errorMessage = formatApiError(err);
          console.error('Error recibido desde API:', err);
        }
      })
  }

  setSessionUser(userData: any, headers: HttpHeaders) {
    let user: IUser = {}

    user.id = userData.id
    user.name = userData.name
    user.last_name = userData.last_name
    user.email = userData.email
    user.roles = userData.roles;

    user.token = headers.get('authorization') || ''

    this._storeContextService.setUser(user)
  }

  formInvalid(): boolean {
    return this.loginForm.invalid
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched
  }
}
