import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundSourceHeatPumpComponent } from './ground-source-heat-pump.component';

describe('GroundSourceHeatPumpComponent', () => {
  let component: GroundSourceHeatPumpComponent;
  let fixture: ComponentFixture<GroundSourceHeatPumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundSourceHeatPumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundSourceHeatPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
