import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreThanTwoHundredKwComponent } from './more-than-two-hundred-kw.component';

describe('MoreThanTwoHundredKwComponent', () => {
  let component: MoreThanTwoHundredKwComponent;
  let fixture: ComponentFixture<MoreThanTwoHundredKwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreThanTwoHundredKwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreThanTwoHundredKwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
