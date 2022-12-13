import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourConnectionDateComponent } from './your-connection-date.component';

describe('YourConnectionDateComponent', () => {
  let component: YourConnectionDateComponent;
  let fixture: ComponentFixture<YourConnectionDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourConnectionDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourConnectionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
