import { TestBed } from '@angular/core/testing';

import { SiteContactDetailsService } from './site-contact-details.service';

describe('SiteContactDetailsService', () => {
  let service: SiteContactDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteContactDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
