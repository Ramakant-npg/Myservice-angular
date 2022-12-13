import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePremisesDetailsComponent } from './single-premises-details.component';

describe('SinglePremisesDetailsComponent', () => {
  let component: SinglePremisesDetailsComponent;
  let fixture: ComponentFixture<SinglePremisesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePremisesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePremisesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
