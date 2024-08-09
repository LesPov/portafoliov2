import { TestBed } from '@angular/core/testing';

import { DvdLogoAnimationService } from './dvd-logo-animation.service';

describe('DvdLogoAnimationService', () => {
  let service: DvdLogoAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DvdLogoAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
