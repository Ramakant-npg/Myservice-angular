import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWorkDateComponent } from './your-work-date.component';

describe('YourWorkDateComponent', () => {
  let component: YourWorkDateComponent;
  let fixture: ComponentFixture<YourWorkDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWorkDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWorkDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
