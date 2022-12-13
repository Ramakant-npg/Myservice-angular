import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreThanFiveMinComponent } from './more-than-five-min.component';

describe('MoreThanFiveMinComponent', () => {
  let component: MoreThanFiveMinComponent;
  let fixture: ComponentFixture<MoreThanFiveMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreThanFiveMinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreThanFiveMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
