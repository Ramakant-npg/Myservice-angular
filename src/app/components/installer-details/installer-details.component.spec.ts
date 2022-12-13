import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallerDetailsComponent } from './installer-details.component';

describe('InstallerDetailsComponent', () => {
  let component: InstallerDetailsComponent;
  let fixture: ComponentFixture<InstallerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
