import { TestBed } from '@angular/core/testing';

import { CardManualreminders } from './card-manualreminders';

describe('CardManualreminders', () => {
  let service: CardManualreminders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardManualreminders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
