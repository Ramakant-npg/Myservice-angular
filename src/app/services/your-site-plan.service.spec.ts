import { TestBed } from '@angular/core/testing';

import { YourSitePlanService } from './your-site-plan.service';

describe('YourSitePlanService', () => {
  let service: YourSitePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourSitePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
