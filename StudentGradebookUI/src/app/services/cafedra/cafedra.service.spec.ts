import { TestBed } from '@angular/core/testing';

import { CafedraService } from './cafedra.service';

describe('CafedraService', () => {
  let service: CafedraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CafedraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
