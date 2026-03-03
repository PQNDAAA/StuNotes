import { TestBed } from '@angular/core/testing';

import { FilterDB } from './filter-db';

describe('FilterDB', () => {
  let service: FilterDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
