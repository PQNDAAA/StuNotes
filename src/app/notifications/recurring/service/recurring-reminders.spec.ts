import { TestBed } from '@angular/core/testing';

import { RecurringReminders } from './recurring-reminders';

describe('RecurringReminders', () => {
  let service: RecurringReminders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurringReminders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
