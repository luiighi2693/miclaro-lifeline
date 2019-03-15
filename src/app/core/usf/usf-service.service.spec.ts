import { TestBed } from '@angular/core/testing';

import { UsfServiceService } from './usf-service.service';

describe('UsfServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsfServiceService = TestBed.get(UsfServiceService);
    expect(service).toBeTruthy();
  });
});
