import { ServicesListComponent } from './components/services/services-list/services-list.component';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { StoreContextService } from './store/store-context.service';
import { IUser } from './models/iuser.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    ServicesListComponent,
    ServiceDetailComponent,
    RegisterComponent,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular_front';
  private user: IUser = {}
  private _storeContextService = inject(StoreContextService)

  ngOnInit(): void {
    this.user = {id: 14, name: 'Luis'}
    this._storeContextService.setUser(this.user)
  }
}
