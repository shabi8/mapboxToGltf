import { TestBed } from '@angular/core/testing';

import { PolygonItems3dService } from './polygon-items3d.service';

describe('PolygonItems3dService', () => {
  let service: PolygonItems3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonItems3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
