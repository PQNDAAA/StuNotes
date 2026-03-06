import { TestBed } from '@angular/core/testing';

import { SettingsDB } from './settings-db';

describe('SettingsDB', () => {
  let service: SettingsDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
