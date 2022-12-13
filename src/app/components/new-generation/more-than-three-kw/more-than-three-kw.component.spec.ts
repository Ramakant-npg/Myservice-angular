import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreThanThreeKwComponent } from './more-than-three-kw.component';

describe('MoreThanThreeKwComponent', () => {
  let component: MoreThanThreeKwComponent;
  let fixture: ComponentFixture<MoreThanThreeKwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreThanThreeKwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreThanThreeKwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
