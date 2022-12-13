import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalEquipmentComponent } from './electrical-equipment.component';

describe('ElectricalEquipmentComponent', () => {
  let component: ElectricalEquipmentComponent;
  let fixture: ComponentFixture<ElectricalEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricalEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
