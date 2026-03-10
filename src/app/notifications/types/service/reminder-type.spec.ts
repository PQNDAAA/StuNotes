import { TestBed } from '@angular/core/testing';

import { ReminderType } from './reminder-type';

describe('ReminderType', () => {
  let service: ReminderType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReminderType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
