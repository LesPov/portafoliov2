import { TestBed } from '@angular/core/testing';

import { ReferenciasAnimacionesService } from './referencias-animaciones.service';

describe('ReferenciasAnimacionesService', () => {
  let service: ReferenciasAnimacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenciasAnimacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
