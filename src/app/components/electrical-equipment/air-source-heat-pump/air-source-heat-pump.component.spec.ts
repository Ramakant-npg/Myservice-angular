import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirSourceHeatPumpComponent } from './air-source-heat-pump.component';

describe('AirSourceHeatPumpComponent', () => {
  let component: AirSourceHeatPumpComponent;
  let fixture: ComponentFixture<AirSourceHeatPumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirSourceHeatPumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirSourceHeatPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
