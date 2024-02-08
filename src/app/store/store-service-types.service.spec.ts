import { TestBed } from '@angular/core/testing';

import { StoreServiceTypesService } from './store-service-types.service';

describe('ServiceTypesService', () => {
  let service: StoreServiceTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreServiceTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
