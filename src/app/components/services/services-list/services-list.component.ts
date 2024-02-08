import { StoreContextService } from '../../../store/store-context.service';
import { Component, OnInit, inject } from '@angular/core';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../../services/api/users.service';

@Component({
  selector: 'services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css'
})
export class ServicesListComponent implements OnInit {
  servicesList: IService[] = []

  private _apiUsersService = inject(UsersService)
  private _storeContextService = inject(StoreContextService)

  constructor() {
  }

  ngOnInit(): void {
    const userId: number = Number(this._storeContextService.getUser()?.id)

    this._apiUsersService.getServicesByUserId(userId).subscribe((data: IService[]) => {
      this.servicesList = data
    })
  }
}
