import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricShowerHeaterComponent } from './electric-shower-heater.component';

describe('ElectricShowerHeaterComponent', () => {
  let component: ElectricShowerHeaterComponent;
  let fixture: ComponentFixture<ElectricShowerHeaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricShowerHeaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricShowerHeaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
