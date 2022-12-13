import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteOwnerDetailsComponent } from './site-owner-details.component';

describe('SiteOwnerDetailsComponent', () => {
  let component: SiteOwnerDetailsComponent;
  let fixture: ComponentFixture<SiteOwnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteOwnerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteOwnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
