import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeKwInstallationFormComponent } from './three-kw-installation-form.component';

describe('ThreeKwInstallationFormComponent', () => {
  let component: ThreeKwInstallationFormComponent;
  let fixture: ComponentFixture<ThreeKwInstallationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeKwInstallationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeKwInstallationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
