import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingOurEquipmentDetailsComponent } from './moving-our-equipment-details.component';

describe('MovingOurEquipmentDetailsComponent', () => {
  let component: MovingOurEquipmentDetailsComponent;
  let fixture: ComponentFixture<MovingOurEquipmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovingOurEquipmentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovingOurEquipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
