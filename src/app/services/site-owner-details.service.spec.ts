import { TestBed } from '@angular/core/testing';

import { SiteOwnerDetailsService } from './site-owner-details.service';

describe('SiteOwnerDetailsService', () => {
  let service: SiteOwnerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteOwnerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
