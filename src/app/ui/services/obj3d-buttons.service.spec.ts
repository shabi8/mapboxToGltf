import { TestBed } from '@angular/core/testing';

import { Obj3dButtonsService } from './obj3d-buttons.service';

describe('Obj3dButtonsService', () => {
  let service: Obj3dButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Obj3dButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
