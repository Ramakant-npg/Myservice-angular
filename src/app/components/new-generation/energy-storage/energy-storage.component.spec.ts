import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyStorageComponent } from './energy-storage.component';

describe('EnergyStorageComponent', () => {
  let component: EnergyStorageComponent;
  let fixture: ComponentFixture<EnergyStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyStorageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
