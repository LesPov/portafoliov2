import { TestBed } from '@angular/core/testing';

import { HabilidadesAnimacionesService } from './habilidades-animaciones.service';

describe('HabilidadesAnimacionesService', () => {
  let service: HabilidadesAnimacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabilidadesAnimacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
