import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoHundredInstallationFormComponent } from './two-hundred-installation-form.component';

describe('TwoHundredInstallationFormComponent', () => {
  let component: TwoHundredInstallationFormComponent;
  let fixture: ComponentFixture<TwoHundredInstallationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoHundredInstallationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoHundredInstallationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
