import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePremisesDetailsComponent } from './multiple-premises-details.component';

describe('PremisesDetailsComponent', () => {
  let component: MultiplePremisesDetailsComponent;
  let fixture: ComponentFixture<MultiplePremisesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePremisesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiplePremisesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
