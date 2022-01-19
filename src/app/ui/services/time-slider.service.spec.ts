import { TestBed } from '@angular/core/testing';

import { TimeSliderService } from './time-slider.service';

describe('TimeSliderService', () => {
  let service: TimeSliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
