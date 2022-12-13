import { TestBed } from '@angular/core/testing';

import { SiteAddressFormService } from './site-address-form.service';

describe('SiteAddressFormService', () => {
  let service: SiteAddressFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteAddressFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
