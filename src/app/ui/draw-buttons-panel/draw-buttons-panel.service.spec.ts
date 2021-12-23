import { TestBed } from '@angular/core/testing';

import { DrawButtonsPanelService } from './draw-buttons-panel.service';

describe('DrawButtonsPanelService', () => {
  let service: DrawButtonsPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawButtonsPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
