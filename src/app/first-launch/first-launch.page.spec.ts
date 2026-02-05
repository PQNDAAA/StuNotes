import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstLaunchPage } from './first-launch.page';

describe('FirstLaunchPage', () => {
  let component: FirstLaunchPage;
  let fixture: ComponentFixture<FirstLaunchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLaunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
