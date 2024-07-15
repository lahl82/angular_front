import { ServicesListComponent } from './components/services/services-list/services-list.component';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { StoreContextService } from './store/store-context.service';
import * as _ from 'lodash';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    ServicesListComponent,
    ServiceDetailComponent,
    RegisterComponent,
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular_front';
  private _storeContextService = inject(StoreContextService)

  searchForm: FormGroup

  private form = inject(FormBuilder)

  constructor() {
    this.searchForm = this.form.group({
      search: ['']
    })
  }


  ngOnInit(): void {
    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this._storeContextService.setSearchCriteria(value)
    })
  }

  hasValidSession(): boolean {
    if (!_.isEmpty(this._storeContextService.getUser())) {
      return true
    } else {
      return false
    }
  }

  userName(): string {
    if (!_.isEmpty(this._storeContextService.getUser())) {
      return this._storeContextService.getUser().name || ''
    } else {
      return 'Invitado'
    }
  }

  search() {

  }
}
