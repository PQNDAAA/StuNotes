import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsHomePage } from './settings-home.page';

describe('SettingsHomePage', () => {
  let component: SettingsHomePage;
  let fixture: ComponentFixture<SettingsHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
