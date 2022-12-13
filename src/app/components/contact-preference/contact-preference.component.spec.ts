import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPreferenceComponent } from './contact-preference.component';

describe('ContactPreferenceComponent', () => {
  let component: ContactPreferenceComponent;
  let fixture: ComponentFixture<ContactPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPreferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
