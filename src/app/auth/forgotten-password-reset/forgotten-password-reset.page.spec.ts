import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgottenPasswordResetPage } from './forgotten-password-reset.page';

describe('ForgottenPasswordResetPage', () => {
  let component: ForgottenPasswordResetPage;
  let fixture: ComponentFixture<ForgottenPasswordResetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgottenPasswordResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
