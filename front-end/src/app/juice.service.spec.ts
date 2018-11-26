import { TestBed } from '@angular/core/testing';

import { JuiceService } from './juice.service';

describe('JuiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JuiceService = TestBed.get(JuiceService);
    expect(service).toBeTruthy();
  });
});
