import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServicesListComponent } from './components/services/services-list/services-list.component';
import { AppointmentSlotManagerComponent } from './components/appointment-slot/appointment-slot-manager/appointment-slot-manager.component';
import { RegisterComponent } from './components/register/register.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { ServiceNewComponent } from './components/services/service-new/service-new.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services-list', component: ServicesListComponent },
  { path: 'appointment-slot-manager', component: AppointmentSlotManagerComponent },
  { path: 'service-new', component: ServiceNewComponent },
  { path: 'services/:serviceId', component: ServiceDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
