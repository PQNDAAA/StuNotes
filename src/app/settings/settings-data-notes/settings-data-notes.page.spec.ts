import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsDataNotesPage } from './settings-data-notes.page';

describe('SettingsDataNotesPage', () => {
  let component: SettingsDataNotesPage;
  let fixture: ComponentFixture<SettingsDataNotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDataNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
