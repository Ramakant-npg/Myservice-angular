import { TestBed } from '@angular/core/testing';

import { PremisesDetailsService } from './premises-details.service';

describe('PremisesDetailsService', () => {
  let service: PremisesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremisesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
