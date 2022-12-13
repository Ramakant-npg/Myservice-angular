import { TestBed } from '@angular/core/testing';

import { YourWorkDateService } from './your-work-date.service';

describe('YourWorkDateService', () => {
  let service: YourWorkDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourWorkDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
