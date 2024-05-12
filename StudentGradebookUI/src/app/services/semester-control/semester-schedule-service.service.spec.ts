import { TestBed } from '@angular/core/testing';

import { SemesterScheduleServiceService } from './semester-schedule-service.service';

describe('SemesterScheduleServiceService', () => {
  let service: SemesterScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemesterScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
