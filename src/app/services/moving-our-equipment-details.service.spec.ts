import { TestBed } from '@angular/core/testing';

import { MovingOurEquipmentDetailsService } from './moving-our-equipment-details.service';

describe('MovingOurEquipmentDetailsService', () => {
  let service: MovingOurEquipmentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovingOurEquipmentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
