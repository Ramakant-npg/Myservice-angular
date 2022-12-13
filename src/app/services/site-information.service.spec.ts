import { TestBed } from '@angular/core/testing';

import { SiteInformationService } from './site-information.service';

describe('SiteInformationService', () => {
  let service: SiteInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
