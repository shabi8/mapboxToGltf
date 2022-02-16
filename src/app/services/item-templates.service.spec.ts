import { TestBed } from '@angular/core/testing';

import { ItemTemplatesService } from './item-templates.service';

describe('ItemTemplatesService', () => {
  let service: ItemTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
