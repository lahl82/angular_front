import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/iuser.model';
import { StoreContextService } from '../../store/store-context.service';
import { Router } from '@angular/router';
import { SessionsService } from '../../services/api/sessions.service';
import { HttpHeaders } from '@angular/common/http';
import { formatApiError } from '../../utils/error-handler';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { ILoginResponse } from '../../models/ilogin-response.model';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../services/ui/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  errorMessage: string = ''
  waiting: boolean = false
  waitingMessage: string = 'Procesando datos. Espere un momento por favor.'

  private form = inject(FormBuilder)
  private storeContextService = inject(StoreContextService)
  private sessionsService = inject(SessionsService)
  private router = inject(Router)
  private toast = inject(ToastService)

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
  }

  ngOnDestroy(): void {
  }

  send() {
    this.waiting = true

    this.sessionsService.logIn(this.loginForm.value)
    .pipe(finalize(() => this.waiting = false))
    .subscribe({
        next: (response: HttpResponse<IApiSuccessResponse<ILoginResponse>>) => {
          const userData = response?.body?.data.user;
          const headers = response?.headers;
          const message = response?.body?.message || 'Sesion iniciada';

          console.log('Sesion iniciada');

          this.setSessionUser(userData, headers)
          this.toast.showSuccess(message);

          this.router.navigate(['services-list']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = formatApiError(error);
          console.error('Error recibido desde API:', error);
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

    this.storeContextService.setUser(user)
  }

  formInvalid(): boolean {
    return this.loginForm.invalid
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched
  }
}
