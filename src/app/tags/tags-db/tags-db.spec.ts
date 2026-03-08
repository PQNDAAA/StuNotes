import { TestBed } from '@angular/core/testing';

import { TagsDB } from './tags-db';

describe('TagsDB', () => {
  let service: TagsDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
