import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwKwInstallationFormComponent } from './mw-kw-installation-form.component';

describe('MwKwInstallationFormComponent', () => {
  let component: MwKwInstallationFormComponent;
  let fixture: ComponentFixture<MwKwInstallationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MwKwInstallationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MwKwInstallationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
