import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsDataTagsPage } from './settings-data-tags.page';

describe('SettingsDataTagsPage', () => {
  let component: SettingsDataTagsPage;
  let fixture: ComponentFixture<SettingsDataTagsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDataTagsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
