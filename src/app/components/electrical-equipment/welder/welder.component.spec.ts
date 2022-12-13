import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelderComponent } from './welder.component';

describe('WelderComponent', () => {
  let component: WelderComponent;
  let fixture: ComponentFixture<WelderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
