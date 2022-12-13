import { TestBed } from '@angular/core/testing';

import { NewGenerationService } from './new-generation.service';

describe('NewGenerationService', () => {
  let service: NewGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
