import { Component, OnInit, inject } from '@angular/core';
import { IService } from '../../models/iservice.model';
import { ApiServicesService } from '../../api-services.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent implements OnInit {
  servicesList: IService[] = []

  private _apiServicesService = inject(ApiServicesService)

  constructor() {
  }

  ngOnInit(): void {
    this._apiServicesService.getAllServices().subscribe((data: IService[]) => {
      console.log(data)
      this.servicesList = data
    })
  }
}
