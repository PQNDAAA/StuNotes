import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsernameFormPage } from './username-form.page';

describe('UsernameFormPage', () => {
  let component: UsernameFormPage;
  let fixture: ComponentFixture<UsernameFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
