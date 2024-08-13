import { TestBed } from '@angular/core/testing';

import { HoverEffectsService } from './hover-effects.service';

describe('HoverEffectsService', () => {
  let service: HoverEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
