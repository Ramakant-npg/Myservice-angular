import { TestBed } from '@angular/core/testing';

import { ExistingGenerationService } from './existing-generation.service';

describe('ExistingGenerationService', () => {
  let service: ExistingGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExistingGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
