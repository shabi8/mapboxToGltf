import { TestBed } from '@angular/core/testing';

import { Item3dListService } from './item3d-list.service';

describe('Item3dListService', () => {
  let service: Item3dListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Item3dListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
