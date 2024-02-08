import { Component, inject } from '@angular/core';
import { IService } from '../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicesService } from '../../services/api/services.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  servicesList: IService[] = []

  private _apiServicesService = inject(ServicesService)

  constructor() {
  }

  ngOnInit(): void {
    this._apiServicesService.getAllServices().subscribe((data: IService[]) => {
      this.servicesList = data
    })
  }
}
