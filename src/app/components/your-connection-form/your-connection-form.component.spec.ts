import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourConnectionFormComponent } from './your-connection-form.component';

describe('YourConnectionFormComponent', () => {
  let component: YourConnectionFormComponent;
  let fixture: ComponentFixture<YourConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourConnectionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
