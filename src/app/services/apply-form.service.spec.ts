import { TestBed } from '@angular/core/testing';

import { ApplyFormService } from './apply-form.service';

describe('ApplyFormService', () => {
  let service: ApplyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
