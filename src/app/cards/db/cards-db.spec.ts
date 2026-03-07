import { TestBed } from '@angular/core/testing';

import { CardsDB } from './cards-db';

describe('CardsDB', () => {
  let service: CardsDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
