import { TestBed } from '@angular/core/testing';

import { InstallerDetailsService } from './installer-details.service';

describe('InstallerDetailsService', () => {
  let service: InstallerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstallerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
