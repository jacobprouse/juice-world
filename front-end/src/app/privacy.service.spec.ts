import { TestBed } from '@angular/core/testing';

import { PrivacyService } from './privacy.service';

describe('PrivacyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivacyService = TestBed.get(PrivacyService);
    expect(service).toBeTruthy();
  });
});
