import { TestBed } from '@angular/core/testing';

import { YourConnectionService } from './your-connection.service';

describe('YourConnectionService', () => {
  let service: YourConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
