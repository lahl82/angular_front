import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSlotManagerComponent } from './appointment-slot-manager.component';

describe('AppointmentSlotManagerComponent', () => {
  let component: AppointmentSlotManagerComponent;
  let fixture: ComponentFixture<AppointmentSlotManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSlotManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSlotManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
