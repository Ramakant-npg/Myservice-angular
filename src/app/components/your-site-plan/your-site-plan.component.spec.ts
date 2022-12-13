import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourSitePlanComponent } from './your-site-plan.component';

describe('YourSitePlanComponent', () => {
  let component: YourSitePlanComponent;
  let fixture: ComponentFixture<YourSitePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourSitePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourSitePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
