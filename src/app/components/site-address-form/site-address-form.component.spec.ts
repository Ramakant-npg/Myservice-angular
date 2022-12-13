import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAddressFormComponent } from './site-address-form.component';

describe('SiteAddressFormComponent', () => {
  let component: SiteAddressFormComponent;
  let fixture: ComponentFixture<SiteAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteAddressFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
