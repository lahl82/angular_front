import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { StoreContextService } from './store/store-context.service';
import * as _ from 'lodash';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageToastComponent } from './components/shared/message-toast/message-toast.component';
import { ToastService } from './services/ui/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MessageToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Guorkers';
  searchForm: FormGroup

  private form = inject(FormBuilder)
  private storeContextService = inject(StoreContextService)
  private toast = inject(ToastService);

  constructor() {
    this.searchForm = this.form.group({
      search: ['']
    })
  }

  ngOnInit(): void {
    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this.storeContextService.setSearchCriteria(value)
    })
  }

  hasValidSession(): boolean {
    return !this.storeContextService.isTokenExpired();
  }

  userName(): string {
    if (!_.isEmpty(this.storeContextService.getUser())) {
      return this.storeContextService.getUser().name || ''
    } else {
      return 'Invitado'
    }
  }

  search() {
        this.toast.showSuccess("Buscando...");
        console.log("Buscando: ", this.searchForm.get('search')?.value);
  }
}
