import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleInstallerDetailsComponent } from './multiple-installer-details.component';

describe('MultipleInstallerDetailsComponent', () => {
  let component: MultipleInstallerDetailsComponent;
  let fixture: ComponentFixture<MultipleInstallerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleInstallerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleInstallerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
