import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesTabPage } from './notes-tab.page';

describe('NotesTabPage', () => {
  let component: NotesTabPage;
  let fixture: ComponentFixture<NotesTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
