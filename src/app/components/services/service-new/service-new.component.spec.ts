import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNewComponent } from './service-new.component';

describe('ServiceNewComponent', () => {
  let component: ServiceNewComponent;
  let fixture: ComponentFixture<ServiceNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
