import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMyAddressComponent } from './change-my-address.component';

describe('ChangeMyAddressComponent', () => {
  let component: ChangeMyAddressComponent;
  let fixture: ComponentFixture<ChangeMyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeMyAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeMyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
