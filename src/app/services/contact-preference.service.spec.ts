import { TestBed } from '@angular/core/testing';

import { ContactPreferenceService } from './contact-preference.service';

describe('ContactPreferenceService', () => {
  let service: ContactPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
