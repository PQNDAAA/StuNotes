import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupApprovedPage } from './signup-approved.page';

describe('SignupApprovedPage', () => {
  let component: SignupApprovedPage;
  let fixture: ComponentFixture<SignupApprovedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupApprovedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
